import { useState } from "react";
import { Camera, Monitor, Smartphone, Tablet, Chrome, Globe, Download, Trash2 } from "lucide-react";

interface Screenshot {
  id: string;
  url: string;
  resolution: string;
  userAgent: string;
  timestamp: Date;
  imageUrl: string;
}

const resolutions = [
  { label: "Desktop (1920x1080)", value: "1920x1080", icon: Monitor },
  { label: "Laptop (1366x768)", value: "1366x768", icon: Monitor },
  { label: "Tablet (768x1024)", value: "768x1024", icon: Tablet },
  { label: "Mobile (375x667)", value: "375x667", icon: Smartphone },
];

const userAgents = [
  { label: "Chrome Desktop", value: "chrome", icon: Chrome },
  { label: "Firefox Desktop", value: "firefox", icon: Globe },
  { label: "Safari Desktop", value: "safari", icon: Globe },
  { label: "Mobile Chrome", value: "mobile-chrome", icon: Smartphone },
];

export default function App() {
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState("1920x1080");
  const [userAgent, setUserAgent] = useState("chrome");
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [urlError, setUrlError] = useState("");

  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError("URL is required");
      return false;
    }
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }
  };

  const handleCapture = async () => {
    if (!validateUrl(url)) {
      return;
    }

    setIsCapturing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create mock screenshot
    const newScreenshot: Screenshot = {
      id: Date.now().toString(),
      url,
      resolution,
      userAgent,
      timestamp: new Date(),
      imageUrl: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop`, // Mock screenshot
    };

    setScreenshots([newScreenshot, ...screenshots]);
    setIsCapturing(false);
  };

  const handleDelete = (id: string) => {
    setScreenshots(screenshots.filter((s) => s.id !== id));
  };

  const handleDownload = (screenshot: Screenshot) => {
    // Mock download functionality
    console.log("Downloading screenshot:", screenshot);
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
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-white mb-2">
                Website URL <span className="text-red-400">*</span>
              </label>
              <input
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
              {urlError && (
                <p className="text-red-400 text-sm mt-2">{urlError}</p>
              )}
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
                      onClick={() => setResolution(res.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        resolution === res.value
                          ? "border-purple-500 bg-purple-500/20 text-white"
                          : "border-white/20 bg-white/5 text-white/80 hover:border-purple-400 hover:bg-white/10"
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
                      onClick={() => setUserAgent(agent.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userAgent === agent.value
                          ? "border-purple-500 bg-purple-500/20 text-white"
                          : "border-white/20 bg-white/5 text-white/80 hover:border-purple-400 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2 mx-auto" />
                      <div className="text-sm font-medium">{agent.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capture Button */}
            <div className="pt-4">
              <button
                onClick={handleCapture}
                disabled={isCapturing || !url}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {isCapturing ? (
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
              </button>
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
                        <span>{userAgents.find((a) => a.value === screenshot.userAgent)?.label}</span>
                      </div>
                      <div className="text-xs text-purple-300">
                        {screenshot.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(screenshot)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(screenshot.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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