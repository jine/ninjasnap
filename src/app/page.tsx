'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Globe,
  Download,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface Screenshot {
  id: string;
  url: string;
  resolution: string;
  userAgent: string;
  timestamp: Date;
  imageUrl: string;
}

const resolutions = [
  { label: 'Desktop (1920x1080)', value: '1920x1080', icon: Monitor },
  { label: 'Laptop (1366x768)', value: '1366x768', icon: Monitor },
  { label: 'Tablet (768x1024)', value: '768x1024', icon: Tablet },
  { label: 'Mobile (375x667)', value: '375x667', icon: Smartphone },
];

const userAgents = [
  {
    label: 'Chrome Desktop',
    value: 'chrome',
    icon: Chrome,
    uaString:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  {
    label: 'Firefox Desktop',
    value: 'firefox',
    icon: Globe,
    uaString:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  },
  {
    label: 'Safari Desktop',
    value: 'safari',
    icon: Globe,
    uaString:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  },
  {
    label: 'Mobile Chrome',
    value: 'mobile-chrome',
    icon: Smartphone,
    uaString:
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  },
];

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
      const uaString =
        userAgents.find((ua) => ua.value === userAgent)?.uaString || userAgent;
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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">NinjaSnap</h1>
          </div>
          <p className="text-xl text-purple-200">
            Capture website screenshots with ninja-like precision and stealth
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
          <div className="space-y-6">
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

            {/* Screenshot Resolution */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Screenshot Resolution
              </label>
              <p className="text-sm text-purple-200 mb-3">
                Choose the viewport size for the screenshot
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {resolutions.map((res) => {
                  const Icon = res.icon;
                  return (
                    <button
                      key={res.value}
                      onClick={() => handleResolutionChange(res.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        resolution === res.value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/80 hover:border-purple-400 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2 mx-auto" />
                      <div className="text-sm font-medium">{res.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Browser User Agent */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Browser User Agent
              </label>
              <p className="text-sm text-purple-200 mb-3">
                Choose how the website sees your browser
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {userAgents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <button
                      key={agent.value}
                      onClick={() => handleUserAgentChange(agent.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userAgent === agent.value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/80 hover:border-purple-400 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2 mx-auto" />
                      <div className="text-sm font-medium">{agent.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

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
          </div>
        </div>

        {/* Previous Screenshots */}
        {screenshots.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              🖼️ Previous Screenshots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screenshots.map((screenshot) => (
                <div
                  key={screenshot.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="aspect-video bg-slate-800 relative overflow-hidden">
                    <img
                      src={screenshot.imageUrl}
                      alt={`Screenshot of ${screenshot.url}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-white font-medium truncate mb-2">
                      {screenshot.url}
                    </div>
                    <div className="text-sm text-purple-200 space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        <span>{screenshot.resolution}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chrome className="w-4 h-4" />
                        <span>
                          {
                            userAgents.find(
                              (a) => a.value === screenshot.userAgent,
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="text-xs text-purple-300">
                        {screenshot.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          window.open(`/screenshot/${screenshot.id}`, '_blank')
                        }
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
