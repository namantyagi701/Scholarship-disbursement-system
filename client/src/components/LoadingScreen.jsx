import React from 'react';
import { GraduationCap } from 'lucide-react';

const LoadingScreen = ({ message = 'Logging you in...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center">
      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Spinning ring + icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="44" stroke="#1e40af" strokeWidth="6" strokeOpacity="0.2" />
            <path
              d="M 50 6 A 44 44 0 0 1 94 50"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-white text-xl font-semibold tracking-wide">{message}</p>
          <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
