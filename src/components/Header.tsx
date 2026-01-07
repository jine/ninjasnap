import { Camera } from 'lucide-react';

export const Header = () => (
  <div className="text-center mb-12">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Camera className="w-12 h-12 text-purple-400" />
      <h1 className="text-5xl font-bold text-white">NinjaSnap</h1>
    </div>
    <p className="text-xl text-purple-200">
      Capture website screenshots with ninja-like precision and stealth
    </p>
  </div>
);
