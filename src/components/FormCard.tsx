import { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export const FormCard = ({ children, className = '' }: FormCardProps) => (
  <div
    className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20 shadow-2xl max-w-4xl mx-auto ${className}`}
  >
    <div className="space-y-6">{children}</div>
  </div>
);
