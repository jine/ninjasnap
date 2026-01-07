import { Chrome, Globe, Smartphone } from 'lucide-react';

interface UserAgentOption {
  label: string;
  value: string;
  icon: typeof Chrome;
}

interface UserAgentSelectorProps {
  selectedUserAgent: string;
  onUserAgentChange: (value: string) => void;
}

const userAgents: UserAgentOption[] = [
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
            onClick={() => onUserAgentChange(agent.value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedUserAgent === agent.value
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
);
