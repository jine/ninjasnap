// IndexedDB utilities for client-side caching
interface CachedScreenshot {
  id: string;
  url: string;
  timestamp: number;
  resolution: string;
  userAgent?: string;
  expiresAt: number; // When to expire from cache
}

const DB_NAME = 'ninjasnap-cache';
const DB_VERSION = 1;
const SCREENSHOT_STORE = 'screenshots';

/**
 * IndexedDB wrapper for caching screenshot data
 */
export class ScreenshotCache {
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create screenshot store
        if (!db.objectStoreNames.contains(SCREENSHOT_STORE)) {
          const store = db.createObjectStore(SCREENSHOT_STORE, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * Cache a screenshot result
   */
  async cacheScreenshot(screenshot: Omit<CachedScreenshot, 'expiresAt'>): Promise<void> {
    if (!this.db) await this.init();

    const cachedScreenshot: CachedScreenshot = {
      ...screenshot,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SCREENSHOT_STORE], 'readwrite');
      const store = transaction.objectStore(SCREENSHOT_STORE);
      const request = store.put(cachedScreenshot);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cached screenshot by ID
   */
  async getScreenshot(id: string): Promise<CachedScreenshot | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SCREENSHOT_STORE], 'readonly');
      const store = transaction.objectStore(SCREENSHOT_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiresAt > Date.now()) {
          resolve(result);
        } else {
          // Expired or not found
          if (result) {
            this.deleteScreenshot(id); // Clean up expired entry
          }
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all cached screenshots
   */
  async getAllScreenshots(): Promise<CachedScreenshot[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SCREENSHOT_STORE], 'readonly');
      const store = transaction.objectStore(SCREENSHOT_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result.filter(
          (screenshot: CachedScreenshot) => screenshot.expiresAt > Date.now()
        );
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a cached screenshot
   */
  async deleteScreenshot(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SCREENSHOT_STORE], 'readwrite');
      const store = transaction.objectStore(SCREENSHOT_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clean up expired entries
   */
  async cleanup(): Promise<void> {
    if (!this.db) await this.init();

    const expiredScreenshots = await this.getAllScreenshots().then(screenshots =>
      screenshots.filter(screenshot => screenshot.expiresAt <= Date.now())
    );

    await Promise.all(
      expiredScreenshots.map(screenshot => this.deleteScreenshot(screenshot.id))
    );
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SCREENSHOT_STORE], 'readwrite');
      const store = transaction.objectStore(SCREENSHOT_STORE);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Global cache instance
export const screenshotCache = new ScreenshotCache();

// Initialize cache on client-side
if (typeof window !== 'undefined') {
  screenshotCache.init().catch(console.error);

  // Clean up expired entries periodically
  setInterval(() => {
    screenshotCache.cleanup().catch(console.error);
  }, 60 * 60 * 1000); // Every hour
}