import { Chrome, Globe, Smartphone } from 'lucide-react';

interface UserAgentSelectorProps {
  selectedUserAgent: string;
  onUserAgentChange: (value: string) => void;
}

const userAgents = [
  {
    label: 'Chrome Desktop',
    value: 'chrome',
    icon: Chrome,
  },
  {
    label: 'Firefox Desktop',
    value: 'firefox',
    icon: Globe,
  },
  {
    label: 'Safari Desktop',
    value: 'safari',
    icon: Globe,
  },
  {
    label: 'Mobile Chrome',
    value: 'mobile-chrome',
    icon: Smartphone,
  },
];

export const UserAgentSelector = ({
  selectedUserAgent,
  onUserAgentChange,
}: UserAgentSelectorProps) => (
  <div>
    <label className="block text-sm font-medium mb-3">Browser User Agent</label>
    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
      Choose how to website sees your browser
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {userAgents.map((agent) => {
        const Icon = agent.icon;
        const isSelected = selectedUserAgent === agent.value;
        return (
          <button
            key={agent.value}
            onClick={() => onUserAgentChange(agent.value)}
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
              style={{ width: '1.5rem', height: '1.5rem' }}
            />
            <div
              className="text-sm font-medium"
              style={{
                color: isSelected
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              }}
            >
              {agent.label}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);
