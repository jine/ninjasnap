'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [userManuallyChangedResolution, setUserManuallyChangedResolution] =
    useState(false);
  // eslint-disable-next-line no-undef
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

  // Auto-switch resolution based on user agent
  useEffect(() => {
    const isMobileUA = userAgent.includes('Mobile');

    if (!userManuallyChangedResolution) {
      if (isMobileUA) {
        setResolution('375x667');
        setNotification('Resolution updated for mobile user agent');
        setTimeout(() => setNotification(''), 3000);
      } else {
        setResolution('1280x720');
        setNotification('Resolution updated for desktop user agent');
        setTimeout(() => setNotification(''), 3000);
      }
    }
  }, [userAgent, userManuallyChangedResolution]);

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
    setUserManuallyChangedResolution(true);
    setUserManuallyChangedUA(false);
  };

  const handleUserAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserAgent(e.target.value);
    setUserManuallyChangedUA(true);
    setUserManuallyChangedResolution(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <main
      className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700"
      role="main"
    >
      <header>
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-400 flex items-center justify-center gap-2">
          🥷 NinjaSnap
        </h1>
        <p className="text-center text-gray-300 mb-6" id="app-description">
          Stealthy screenshot capture tool with ninja-like precision
        </p>
      </header>

      {/* Status announcements for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        aria-label="Status updates"
      >
        {notification && `Update: ${notification}`}
        {error && `Error: ${error}`}
        {loading && 'Processing screenshot request'}
      </div>

      {/* Notification banner */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 p-3 bg-emerald-900/50 border border-emerald-600 rounded-md text-emerald-200"
          aria-label={`Notification: ${notification}`}
        >
          {notification}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-4"
        role="form"
        aria-label="Screenshot capture form"
        aria-describedby="app-description"
      >
        <div>
          <label
            htmlFor="url-input"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Website URL <span aria-label="required">*</span>
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to capture..."
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="url-help url-error"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            autoComplete="url"
            autoFocus
          />
          <p id="url-help" className="mt-1 text-sm text-gray-400">
            Enter a valid website URL (e.g., https://example.com)
          </p>
          {error && (
            <p
              id="url-error"
              className="mt-1 text-sm text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="resolution-select"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Screenshot Resolution
          </label>
          <select
            id="resolution-select"
            value={resolution}
            onChange={handleResolutionChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="resolution-help"
            aria-label="Select screenshot resolution"
          >
            <option value="1920x1080">1920×1080 (Full HD Desktop)</option>
            <option value="1366x768">1366×768 (HD Desktop)</option>
            <option value="1280x720">1280×720 (HD Desktop)</option>
            <option value="1024x768">1024×768 (XGA Desktop)</option>
            <option value="768x1024">768×1024 (Tablet Portrait)</option>
            <option value="375x667">375×667 (Mobile)</option>
          </select>
          <p id="resolution-help" className="mt-1 text-sm text-gray-400">
            Choose the viewport size for the screenshot
          </p>
        </div>

        <div>
          <label
            htmlFor="user-agent-select"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Browser User Agent
          </label>
          <select
            id="user-agent-select"
            value={userAgent}
            onChange={handleUserAgentChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="user-agent-help"
            aria-label="Select browser user agent"
          >
            <optgroup label="Desktop Browsers">
              <option value="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36">
                Google Chrome (Desktop)
              </option>
              <option value="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0">
                Mozilla Firefox (Desktop)
              </option>
              <option value="Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15">
                Apple Safari (Desktop)
              </option>
              <option value="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0">
                Microsoft Edge (Desktop)
              </option>
            </optgroup>
            <optgroup label="Mobile Browsers">
              <option value="Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1">
                Safari (iPhone)
              </option>
              <option value="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36">
                Chrome (Android)
              </option>
              <option value="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36">
                Samsung Browser (Android)
              </option>
            </optgroup>
          </select>
          <p id="user-agent-help" className="mt-1 text-sm text-gray-400">
            Choose how the website sees your browser
          </p>
        </div>

        <div className="flex items-center">
          <input
            id="adblock-checkbox"
            type="checkbox"
            checked={enableAdblock}
            onChange={(e) => setEnableAdblock(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="adblock-help"
          />
          <label
            htmlFor="adblock-checkbox"
            className="ml-2 block text-sm text-gray-300 cursor-pointer"
          >
            Enable ad blocker
          </label>
          <p id="adblock-help" className="sr-only">
            When enabled, blocks advertisements and tracking scripts during
            screenshot capture
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold flex items-center justify-center gap-2"
          aria-describedby={loading ? 'loading-status' : 'submit-help'}
          aria-label={
            loading
              ? 'Capturing screenshot, please wait'
              : 'Capture screenshot of the entered URL'
          }
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="img"
                aria-label="Loading spinner"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span id="loading-status" aria-live="polite">
                Capturing screenshot...
              </span>
            </>
          ) : (
            <>
              <span>🎯 Capture Screenshot</span>
            </>
          )}
        </button>
        <p id="submit-help" className="sr-only">
          Click to capture a screenshot of the website URL you entered above
        </p>
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
    </main>
  );
}
