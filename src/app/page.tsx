'use client';

import { useState, useEffect, useRef } from 'react';

const RESOLUTIONS = [
  '1920x1080',
  '1366x768',
  '1280x720',
  '1024x768',
  '768x1024',
  '375x667',
];

const USER_AGENTS = [
  {
    label: 'Chrome 120 (Desktop)',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  {
    label: 'Firefox 121 (Desktop)',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  },
  {
    label: 'Safari 17 (Desktop)',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  },
  {
    label: 'Edge 120 (Desktop)',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  },
  {
    label: 'iPhone Safari (iOS 17)',
    value:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  },
  {
    label: 'Android Chrome',
    value:
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  },
  {
    label: 'Samsung Internet',
    value:
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36',
  },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [resolution, setResolution] = useState('1280x720');
  const [userAgent, setUserAgent] = useState(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );
  const [enableAdblock, setEnableAdblock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [userManuallyChangedUA, setUserManuallyChangedUA] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // Auto-switch user agent based on resolution
  useEffect(() => {
    const isMobileResolution = ['768x1024', '375x667'].includes(resolution);

    if (!userManuallyChangedUA) {
      if (isMobileResolution) {
        setUserAgent(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
        );
        setNotification('User agent updated for mobile compatibility');
        setTimeout(() => setNotification(''), 3000);
      } else {
        setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        );
        setNotification('User agent updated for desktop');
        setTimeout(() => setNotification(''), 3000);
      }
    }
  }, [resolution, userManuallyChangedUA]);

  // Focus management for errors
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, resolution, userAgent, enableAdblock }),
      });

      if (!response.ok) {
        throw new Error('Failed to take screenshot');
      }

      const data = await response.json();
      window.location.href = `/screenshot/${data.id}`;
    } catch (err) {
      setError('Error taking screenshot. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResolution(e.target.value);
  };

  const handleUserAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserAgent(e.target.value);
    setUserManuallyChangedUA(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-400 flex items-center justify-center gap-2">
        🥷 NinjaSnap
      </h1>
      <p className="text-center text-gray-300 mb-6">
        Stealthy screenshot capture
      </p>
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-4"
        role="form"
        aria-label="Screenshot capture form"
      >
        <div>
          <label
            htmlFor="url-input"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Website URL
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to capture..."
            required
            aria-describedby="url-help"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
          <p id="url-help" className="sr-only">
            Enter a valid URL starting with http:// or https:// for screenshot
            capture
          </p>
        </div>

        <div>
          <label
            htmlFor="resolution-select"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Resolution
          </label>
          <select
            id="resolution-select"
            value={resolution}
            onChange={handleResolutionChange}
            aria-describedby="resolution-help"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {RESOLUTIONS.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
          <p id="resolution-help" className="sr-only">
            Choose the viewport resolution for the screenshot
          </p>
        </div>

        <div>
          <label
            htmlFor="user-agent-select"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            User Agent
          </label>
          <select
            id="user-agent-select"
            value={userAgent}
            onChange={handleUserAgentChange}
            aria-describedby="ua-help"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {USER_AGENTS.map((ua) => (
              <option key={ua.value} value={ua.value}>
                {ua.label}
              </option>
            ))}
          </select>
          <p id="ua-help" className="sr-only">
            Select browser user agent - will auto-switch for mobile resolutions
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="adblock"
            checked={enableAdblock}
            onChange={(e) => setEnableAdblock(e.target.checked)}
            aria-describedby="adblock-help"
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="adblock" className="ml-2 block text-sm text-gray-300">
            Enable uBlock Origin adblock
          </label>
          <p id="adblock-help" className="sr-only">
            Enable ad blocking for cleaner screenshots
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-describedby="submit-help"
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {loading ? 'Capturing...' : '🗡️ Take Screenshot'}
        </button>
        <p id="submit-help" className="sr-only">
          {loading
            ? 'Screenshot is being captured, please wait'
            : 'Click to capture screenshot of the entered URL'}
        </p>
      </form>

      {notification && (
        <div className="mt-4 p-2 bg-emerald-900/20 border border-emerald-600 rounded text-emerald-400 text-center">
          {notification}
        </div>
      )}
      {error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="text-red-400 text-center mt-4 bg-red-900/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {error}
        </div>
      )}
    </div>
  );
}
