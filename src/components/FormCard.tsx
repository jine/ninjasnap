import { ReactNode } from 'react';

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export const FormCard = ({ children, className = '' }: FormCardProps) => (
  <div
    className={`max-w-4xl mx-auto backdrop-blur-lg ${className}`}
    style={{
      background: 'var(--form-card-bg)',
      backdropFilter: 'var(--form-card-backdrop)',
      border: 'var(--form-card-border)',
      borderRadius: 'var(--form-card-radius)',
      padding: 'var(--form-card-padding)',
      boxShadow: 'var(--form-card-shadow)',
      marginBottom: 'var(--form-card-margin-bottom)',
    }}
  >
    {children}
  </div>
);
