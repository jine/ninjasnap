import { Download, Monitor, Chrome, Globe, Smartphone } from 'lucide-react';

interface Screenshot {
  id: string;
  url: string; // Website URL (may be unknown from API)
  resolution: string; // May be "Unknown" if not available
  userAgent: string; // May be "Unknown" if not available
  timestamp: Date | string | null | undefined; // Allow multiple types for robustness
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
      <h2
        className="text-3xl font-bold mb-6 flex items-center gap-3"
        style={{ color: 'var(--text-primary)' }}
      >
        🖼️ Previous Screenshots
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ gap: 'var(--space-8)' }}
      >
        {screenshots.map((screenshot) => (
          <div
            key={screenshot.id}
            className="overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'var(--blur-lg)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              transition: 'box-shadow var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget as HTMLElement;
              card.style.boxShadow = 'var(--shadow-2xl)';
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget as HTMLElement;
              card.style.boxShadow = 'var(--shadow-xl)';
            }}
          >
            <div
              className="aspect-video relative overflow-hidden"
              style={{ background: 'var(--bg-screenshot-placeholder)' }}
            >
              <img
                src={screenshot.imageUrl}
                alt={`Screenshot of ${screenshot.url}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="p-4"
              style={{ padding: 'var(--screenshot-card-padding)' }}
            >
              <div
                className="font-medium truncate mb-2"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                {screenshot.url === screenshot.imageUrl
                  ? `Screenshot ${screenshot.id}`
                  : screenshot.url}
              </div>
              <div
                className="text-sm mb-3"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
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
                <div
                  className="text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {(() => {
                    try {
                      if (!screenshot.timestamp) return 'Unknown date';
                      let date: Date;
                      if (screenshot.timestamp instanceof Date) {
                        date = screenshot.timestamp;
                      } else if (typeof screenshot.timestamp === 'string') {
                        date = new Date(screenshot.timestamp);
                      } else {
                        return 'Unknown date';
                      }
                      if (isNaN(date.getTime())) return 'Invalid date';
                      return date.toLocaleString();
                    } catch (error) {
                      console.error(
                        'Error formatting timestamp:',
                        error,
                        screenshot.timestamp,
                      );
                      return 'Unknown date';
                    }
                  })()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(`/screenshot/${screenshot.id}`, '_blank')
                  }
                  className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--action-button-primary-bg)',
                    color: 'var(--text-primary)',
                    padding:
                      'var(--action-button-padding-y) var(--action-button-padding-x)',
                    fontSize: 'var(--action-button-font-size)',
                    fontWeight: 'var(--action-button-font-weight)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget as HTMLElement;
                    btn.style.background =
                      'var(--action-button-primary-bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget as HTMLElement;
                    btn.style.background = 'var(--action-button-primary-bg)';
                  }}
                >
                  <Download className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
