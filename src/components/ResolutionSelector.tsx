import { Monitor, Smartphone, Tablet, Tv, Maximize } from 'lucide-react';

interface ResolutionSelectorProps {
  selectedResolution: string;
  onResolutionChange: (value: string) => void;
}

const resolutions = [
  { label: '4K UHD (3840x2160)', value: '3840x2160', icon: Tv },
  { label: 'Ultrawide (3440x1440)', value: '3440x1440', icon: Maximize },
  { label: 'Desktop (1920x1080)', value: '1920x1080', icon: Monitor },
  { label: 'Laptop (1366x768)', value: '1366x768', icon: Monitor },
  { label: 'Tablet (768x1024)', value: '768x1024', icon: Tablet },
  { label: 'Mobile (375x667)', value: '375x667', icon: Smartphone },
];

export const ResolutionSelector = ({
  selectedResolution,
  onResolutionChange,
}: ResolutionSelectorProps) => (
  <div>
    <label className="block text-sm font-medium mb-3">
      Screenshot Resolution
    </label>
    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
      Choose the viewport size for the screenshot
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {resolutions.map((res) => {
        const Icon = res.icon;
        const isSelected = selectedResolution === res.value;
        return (
          <button
            key={res.value}
            onClick={() => onResolutionChange(res.value)}
            className="p-4 rounded-lg border-2 transition-all"
            style={{
              padding: 'var(--selection-button-padding)',
              borderWidth: 'var(--selection-button-border-width)',
              borderColor: isSelected
                ? 'var(--selection-button-border-selected)'
                : 'var(--selection-button-border-default)',
              backgroundColor: isSelected
                ? 'var(--selection-button-bg-selected)'
                : 'var(--selection-button-bg-default)',
              color: isSelected
                ? 'var(--selection-button-text-selected)'
                : 'var(--selection-button-text-default)',
            }}
          >
            <Icon
              className="w-6 h-6 mb-2 mx-auto"
              style={{ width: 'var(--icon-md)', height: 'var(--icon-md)' }}
            />
            <div
              className="text-sm font-medium"
              style={{
                color: isSelected
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              }}
            >
              {res.label}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);
