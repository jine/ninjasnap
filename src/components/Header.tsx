import { Camera } from 'lucide-react';

export const Header = () => (
  <div
    className="text-center mb-12"
    style={{ marginBottom: 'var(--header-margin-bottom)' }}
  >
    <div
      className="flex items-center justify-center gap-3 mb-4"
      style={{ gap: 'var(--header-gap)' }}
    >
      <Camera
        className="w-12 h-12"
        style={{
          color: 'var(--header-icon-color)',
          width: 'var(--header-icon-size)',
          height: 'var(--header-icon-size)',
        }}
      />
      <h1
        className="text-5xl font-bold"
        style={{
          color: 'var(--header-title-color)',
          fontSize: 'var(--header-title-size)',
        }}
      >
        NinjaSnap
      </h1>
    </div>
    <p
      className="text-xl"
      style={{
        color: 'var(--header-subtitle-color)',
        fontSize: 'var(--header-subtitle-size)',
      }}
    >
      Capture website screenshots with ninja-like precision and stealth
    </p>
  </div>
);
