import { Download, Monitor, Chrome, Globe, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

interface Screenshot {
  id: string;
  url: string; // Website URL (may be unknown from API)
  resolution: string; // May be "Unknown" if not available
  userAgent: string; // May be "Unknown" if not available
  timestamp: Date;
  imageUrl: string;
}

interface ScreenshotGridProps {
  screenshots: Screenshot[];
}

const userAgents = [
  { label: 'Chrome Desktop', value: 'chrome', icon: Chrome },
  { label: 'Firefox Desktop', value: 'firefox', icon: Globe },
  { label: 'Safari Desktop', value: 'safari', icon: Globe },
  { label: 'Mobile Chrome', value: 'mobile-chrome', icon: Smartphone },
];

export const ScreenshotGrid = ({ screenshots }: ScreenshotGridProps) => {
  if (screenshots.length === 0) return null;

  return (
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
                {screenshot.url === screenshot.imageUrl
                  ? `Screenshot ${screenshot.id}`
                  : screenshot.url}
              </div>
              <div className="text-sm text-purple-200 space-y-1 mb-3">
                {screenshot.resolution !== 'Unknown' && (
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>{screenshot.resolution}</span>
                  </div>
                )}
                {screenshot.userAgent !== 'Unknown' && (
                  <div className="flex items-center gap-2">
                    <Chrome className="w-4 h-4" />
                    <span>
                      {
                        userAgents.find((a) => a.value === screenshot.userAgent)
                          ?.label
                      }
                    </span>
                  </div>
                )}
                <div className="text-xs text-purple-300">
                  {screenshot.timestamp
                    ? screenshot.timestamp.toLocaleString()
                    : 'Unknown date'}
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
  );
};
