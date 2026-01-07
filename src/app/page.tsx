'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Header } from '../components/Header';
import { ResolutionSelector } from '../components/ResolutionSelector';
import { UserAgentSelector } from '../components/UserAgentSelector';
import { FormCard } from '../components/FormCard';
import { ScreenshotGrid } from '../components/ScreenshotGrid';

interface Screenshot {
  id: string;
  url: string;
  resolution: string;
  userAgent: string;
  timestamp: Date;
  imageUrl: string;
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
  // eslint-disable-next-line no-undef
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
      .then((data) => setScreenshots(data))
      .catch((err) => console.error('Failed to load screenshots:', err));
  }, []);

  const validateUrl = (value: string) => {
    if (!value) {
      setError('URL is required');
      return false;
    }
    try {
      // eslint-disable-next-line no-undef
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Header />

        <FormCard>
          {/* URL Input */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-white mb-2"
            >
              Website URL <span className="text-red-400">*</span>
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
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
              className="h-4 w-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 disabled:opacity-50"
            />
            <label
              htmlFor="adblock-checkbox"
              className="ml-2 block text-sm text-white cursor-pointer"
            >
              Enable ad blocker
            </label>
          </div>

          {/* Capture Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || !url}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Capturing Screenshot...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Click to capture screenshot of the entered URL
                </>
              )}
            </Button>
            <p className="text-center text-sm text-purple-200 mt-2">
              Click to capture screenshot of the website URL you entered above
            </p>
          </div>
        </FormCard>

        <ScreenshotGrid screenshots={screenshots} />
      </div>
    </div>
  );
}
