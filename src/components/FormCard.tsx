import { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export const FormCard = ({ children, className = '' }: FormCardProps) => (
  <div
    className={`max-w-4xl mx-auto mb-12 backdrop-blur-lg ${className}`}
    style={{
      background: 'var(--form-card-bg)',
      backdropFilter: 'var(--form-card-backdrop)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--form-card-radius)',
      padding: 'var(--form-card-padding)',
      boxShadow: 'var(--form-card-shadow)',
    }}
  >
    {children}
  </div>
);
