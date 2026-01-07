'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { performanceMonitor } from '@/lib/performance-monitor';

// Custom hook for performance monitoring
export function usePerformanceMonitoring(name: string) {
  const startTimeRef = useRef<number | undefined>(undefined);

  const startMeasurement = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const endMeasurement = useCallback(
    (tags?: Record<string, string>) => {
      if (startTimeRef.current) {
        const duration = Date.now() - startTimeRef.current;
        performanceMonitor.record(name, duration, tags);
        startTimeRef.current = undefined;
      }
    },
    [name],
  );

  const measureAsync = useCallback(
    async <T>(
      operation: () => Promise<T>,
      tags?: Record<string, string>,
    ): Promise<T> => {
      startMeasurement();
      try {
        const result = await operation();
        endMeasurement({ ...tags, success: 'true' });
        return result;
      } catch (error) {
        endMeasurement({
          ...tags,
          success: 'false',
          error: (error as Error).message,
        });
        throw error;
      }
    },
    [startMeasurement, endMeasurement],
  );

  return {
    startMeasurement,
    endMeasurement,
    measureAsync,
  };
}

// Custom hook for caching with TTL
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000, // 5 minutes default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(
    new Map(),
  );

  const getCachedData = useCallback(
    (cacheKey: string) => {
      const cached = cacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
      return null;
    },
    [ttl],
  );

  const setCachedData = useCallback((cacheKey: string, data: T) => {
    cacheRef.current.set(cacheKey, { data, timestamp: Date.now() });
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getCachedData(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return cached;
      }

      // Fetch fresh data
      const result = await fetcher();
      setCachedData(key, result);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, getCachedData, setCachedData]);

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key);
    setData(null);
  }, [key]);

  // Auto-fetch on mount if no cached data
  useEffect(() => {
    const cached = getCachedData(key);
    if (!cached && !loading) {
      fetch().catch(() => {
        // Ignore errors on mount
      });
    }
  }, [key, getCachedData, loading, fetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    invalidate,
  };
}

// Custom hook for debounced search/input
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for intersection observer (lazy loading)
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit,
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Custom hook for local storage with SSR safety
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}

// Custom hook for window size (responsive design)
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}

// Custom hook for network status (offline detection)
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return isOnline;
}

// Custom hook for retry logic
export function useRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        setLoading(false);
        return result;
      } catch (err) {
        lastError = err as Error;
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, delay * Math.pow(2, attempt)),
          );
        }
      }
    }

    setLoading(false);
    setError(lastError!);
    return null;
  }, [operation, maxRetries, delay]);

  return {
    execute,
    loading,
    error,
  };
}
