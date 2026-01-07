'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Header } from '../components/Header';
import { ResolutionSelector } from '../components/ResolutionSelector';
import { UserAgentSelector } from '../components/UserAgentSelector';
import { FormCard } from '../components/FormCard';
import { ScreenshotGrid } from '../components/ScreenshotGrid';

interface Screenshot {
  id: string;
  url: string; // Website URL (may be unknown from API)
  resolution: string; // May be "Unknown" if not available
  userAgent: string; // May be "Unknown" if not available
  timestamp: Date | string | null | undefined; // Allow multiple types for robustness
  imageUrl: string;
}

interface ScreenshotApiResponse {
  id: string;
  url: string;
  createdAt: string;
}

// User agent mapping for API calls
const userAgentMap: Record<string, string> = {
  chrome:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  firefox:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  safari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'mobile-chrome':
    'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [resolution, setResolution] = useState('1920x1080');
  const [userAgent, setUserAgent] = useState('chrome');
  const [enableAdblock, setEnableAdblock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [userManuallyChangedUA, setUserManuallyChangedUA] = useState(false);
  const [userManuallyChangedResolution, setUserManuallyChangedResolution] =
    useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // Auto-switch user agent based on resolution
  useEffect(() => {
    const isMobileResolution = ['768x1024', '375x667'].includes(resolution);

    if (!userManuallyChangedUA) {
      if (isMobileResolution) {
        setUserAgent('mobile-chrome');
      } else {
        setUserAgent('chrome');
      }
    }
  }, [resolution, userManuallyChangedUA]);

  // Auto-switch resolution based on user agent
  useEffect(() => {
    const isMobileUA = userAgent.includes('mobile');

    if (!userManuallyChangedResolution) {
      if (isMobileUA) {
        setResolution('375x667');
      } else {
        setResolution('1920x1080');
      }
    }
  }, [userAgent, userManuallyChangedResolution]);

  // Focus management for errors
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // Load previous screenshots
  useEffect(() => {
    fetch('/api/screenshots')
      .then((res) => res.json())
      .then((data) => {
        // Transform API response to match Screenshot interface
        const transformedData = data.map((item: ScreenshotApiResponse) => {
          const timestamp = item.createdAt
            ? new Date(item.createdAt)
            : new Date();
          return {
            id: item.id || 'unknown',
            url: item.url || '/unknown-url', // This is the image URL from API, but we'll display it as website URL
            resolution: 'Unknown', // API doesn't provide this
            userAgent: 'Unknown', // API doesn't provide this
            timestamp: timestamp, // Convert ISO string to Date object
            imageUrl: item.url || '/placeholder.png', // The API returns url as the image URL
          };
        });
        setScreenshots(transformedData);
      })
      .catch((err) => {
        console.error('Failed to load screenshots:', err);
        setScreenshots([]); // Ensure we have an empty array on error
      });
  }, []);

  const validateUrl = (value: string) => {
    if (!value) {
      setError('URL is required');
      return false;
    }
    try {
      new URL(value);
      setError('');
      return true;
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    setLoading(true);
    setError('');

    try {
      const uaString = userAgentMap[userAgent] || userAgent;
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          resolution,
          userAgent: uaString,
          enableAdblock,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to take screenshot');
      }

      const data = await response.json();

      // Create mock screenshot for display (since we navigate to the actual screenshot page)
      const newScreenshot: Screenshot = {
        id: data.id,
        url,
        resolution,
        userAgent,
        timestamp: new Date(),
        imageUrl: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop`,
      };

      setScreenshots([newScreenshot, ...screenshots]);
      window.location.href = `/screenshot/${data.id}`;
    } catch (err) {
      setError('Error taking screenshot. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolutionChange = (value: string) => {
    setResolution(value);
    setUserManuallyChangedResolution(true);
    setUserManuallyChangedUA(false);
  };

  const handleUserAgentChange = (value: string) => {
    setUserAgent(value);
    setUserManuallyChangedUA(true);
    setUserManuallyChangedResolution(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto px-4 py-12 max-w-3xl">
        <Header />

        <FormCard>
          {/* URL Input */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Website URL <span style={{ color: 'var(--text-error)' }}>*</span>
            </label>
            <Input
              type="text"
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (e.target.value) validateUrl(e.target.value);
              }}
              placeholder="Enter a valid website URL (e.g., https://example.com)"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            {error && (
              <p
                className="text-sm mt-2"
                style={{ color: 'var(--text-error)' }}
              >
                {error}
              </p>
            )}
          </div>

          <ResolutionSelector
            selectedResolution={resolution}
            onResolutionChange={handleResolutionChange}
          />

          <UserAgentSelector
            selectedUserAgent={userAgent}
            onUserAgentChange={handleUserAgentChange}
          />

          {/* Adblock Toggle */}
          <div className="flex items-center">
            <input
              id="adblock-checkbox"
              type="checkbox"
              checked={enableAdblock}
              onChange={(e) => setEnableAdblock(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded focus:ring-2 disabled:opacity-50"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                accentColor: 'var(--accent-purple)',
              }}
            />
            <label
              htmlFor="adblock-checkbox"
              className="ml-2 block text-sm cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              Enable ad blocker
            </label>
          </div>

          {/* Capture Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !url}
              className="w-full rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--gradient-button)',
                color: 'var(--text-primary)',
                padding:
                  'var(--capture-button-padding-y) var(--capture-button-padding-x)',
                fontSize: 'var(--capture-button-font-size)',
                fontWeight: 'var(--capture-button-font-weight)',
                boxShadow: 'var(--capture-button-shadow)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={() => {
                const button = document.activeElement;
                if (button instanceof HTMLElement) {
                  button.style.background = 'var(--gradient-button-hover)';
                  button.style.boxShadow = 'var(--capture-button-shadow-hover)';
                }
              }}
              onMouseLeave={() => {
                const button = document.activeElement;
                if (button instanceof HTMLElement) {
                  button.style.background = 'var(--gradient-button)';
                  button.style.boxShadow = 'var(--capture-button-shadow)';
                }
              }}
            >
              {loading ? (
                <>
                  <div
                    className="w-5 h-5 border-2 border-white rounded-full"
                    style={{
                      borderColor: 'transparent',
                      borderTopColor: 'var(--text-primary)',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <span>Capturing Screenshot...</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>Click to capture screenshot of the entered URL</span>
                </>
              )}
            </button>
            <p
              className="text-center text-sm mt-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Click to capture screenshot of website URL you entered above
            </p>
          </div>
        </FormCard>

        <ScreenshotGrid screenshots={screenshots} />
      </div>
    </div>
  );
}
