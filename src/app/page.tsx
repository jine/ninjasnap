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
      className="max-w-md mx-auto mt-20 p-6 bg-[#1A1A1A] rounded-xl shadow-2xl border border-[#808080]/30 backdrop-blur-sm"
      role="main"
    >
      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF0000] rounded-2xl shadow-lg shadow-[#FF0000]/25 mb-4 animate-pulse">
          <span className="text-3xl text-[#000000]">🥷</span>
        </div>
        <h1
          className="text-3xl font-bold text-[#FFFFFF] mb-2"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            letterSpacing: '0.5px',
          }}
        >
          NinjaSnap
        </h1>
        <div className="h-1 w-20 bg-[#FF0000] rounded-full mx-auto mb-4"></div>
        <p
          className="text-[#CCCCCC] leading-relaxed text-sm"
          id="app-description"
          style={{ fontFamily: "'Noto Sans', sans-serif", lineHeight: '1.5' }}
        >
          Capture website screenshots with{' '}
          <span className="text-[#00FF00] font-semibold">
            ninja-like precision
          </span>{' '}
          and stealth
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

      {/* Enhanced notification banner */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 bg-[#1A1A1A]/80 border border-[#00FF00]/30 rounded-xl text-[#00FF00] backdrop-blur-sm shadow-lg shadow-[#00FF00]/10 animate-in slide-in-from-top-2 duration-300"
          aria-label={`Notification: ${notification}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse"></div>
            <span
              className="font-medium text-[#FFFFFF]"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              {notification}
            </span>
          </div>
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
            className="block text-sm font-medium text-[#FFFFFF] mb-2"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 400 }}
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
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#808080]/50 rounded-lg text-[#FFFFFF] placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '14px',
              lineHeight: '1.5',
            }}
            aria-describedby="url-help url-error"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            autoComplete="url"
            autoFocus
          />
          <p
            id="url-help"
            className="mt-1 text-sm text-[#CCCCCC]"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: '12px' }}
          >
            Enter a valid website URL (e.g., https://example.com)
          </p>
          {error && (
            <p
              id="url-error"
              className="mt-1 text-sm text-[#800080]"
              role="alert"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: '12px',
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="resolution-select"
            className="block text-sm font-medium text-[#FFFFFF] mb-2"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 400 }}
          >
            Screenshot Resolution
          </label>
          <select
            id="resolution-select"
            value={resolution}
            onChange={handleResolutionChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#808080]/50 rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 appearance-none"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: '14px' }}
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
          <p
            id="resolution-help"
            className="mt-1 text-sm text-[#CCCCCC]"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: '12px' }}
          >
            Choose the viewport size for the screenshot
          </p>
        </div>

        <div>
          <label
            htmlFor="user-agent-select"
            className="block text-sm font-medium text-[#FFFFFF] mb-2"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 400 }}
          >
            Browser User Agent
          </label>
          <select
            id="user-agent-select"
            value={userAgent}
            onChange={handleUserAgentChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#808080]/50 rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 appearance-none"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: '14px' }}
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
          <p
            id="user-agent-help"
            className="mt-1 text-sm text-[#CCCCCC]"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: '12px' }}
          >
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
            className="h-4 w-4 text-[#FF0000] bg-[#1A1A1A] border-[#808080] rounded focus:ring-[#FF0000] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="adblock-help"
          />
          <label
            htmlFor="adblock-checkbox"
            className="ml-2 block text-sm text-[#FFFFFF] cursor-pointer"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
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
          className="w-full bg-[#FF0000] hover:bg-[#FF0000]/80 text-[#000000] py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-[#FF0000]/25 hover:shadow-[#FF0000]/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 group"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            padding: '16px 24px',
            borderRadius: '4px',
          }}
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
                className="animate-spin h-6 w-6"
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
              <span id="loading-status" aria-live="polite" className="text-lg">
                Capturing screenshot...
              </span>
            </>
          ) : (
            <>
              <span className="text-xl group-hover:animate-bounce">🎯</span>
              <span className="text-lg">Capture Screenshot</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
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

      {/* Footer */}
      <footer className="text-center mt-8 text-gray-400 text-sm">
        <p className="flex items-center justify-center gap-2">
          <span className="text-emerald-400">⚡</span>
          Powered by modern web technologies
          <span className="text-blue-400">🚀</span>
        </p>
      </footer>
    </main>
  );
}
