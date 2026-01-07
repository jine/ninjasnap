import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface ResolutionOption {
  label: string;
  value: string;
  icon: typeof Monitor;
}

interface ResolutionSelectorProps {
  selectedResolution: string;
  onResolutionChange: (value: string) => void;
}

const resolutions: ResolutionOption[] = [
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
            onClick={() => onResolutionChange(res.value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedResolution === res.value
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
);
