import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F3] flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Top Hairline Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#E5E0D4] overflow-hidden z-50">
        <div className="h-full bg-gradient-to-r from-[#16213E] via-[#B8860B] to-[#16213E] w-1/3 animate-indeterminate" />
      </div>

      {/* Subtle archival corner brackets */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-[#DCD6C8]/60 pointer-events-none hidden sm:block" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-[#DCD6C8]/60 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-[#DCD6C8]/60 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-[#DCD6C8]/60 pointer-events-none hidden sm:block" />

      {/* Main card */}
      <div className="relative w-full max-w-sm border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-8 sm:p-10 shadow-[0_4px_24px_-4px_rgba(22,33,62,0.06)] flex flex-col items-center text-center">
        {/* Emblem with smooth gold orbit */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          {/* Subtle warm halo */}
          <div className="absolute inset-0 rounded-full bg-[#B8860B]/5 animate-pulse" />

          {/* Outer elegant rotating dashed ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_6s_linear_infinite]"
            viewBox="0 0 80 80"
          >
            <circle
              cx="40"
              cy="40"
              r="37"
              fill="none"
              stroke="#B8860B"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.6"
            />
          </svg>

          {/* Inner rotating accent arc */}
          <svg
            className="absolute inset-1.5 w-[68px] h-[68px] animate-[spin_2.2s_cubic-bezier(0.4,0,0.2,1)_infinite]"
            viewBox="0 0 68 68"
          >
            <circle
              cx="34"
              cy="34"
              r="31"
              fill="none"
              stroke="#16213E"
              strokeWidth="1.5"
              strokeDasharray="48 140"
              strokeLinecap="round"
            />
          </svg>

          {/* Center icon badge */}
          <div className="w-12 h-12 rounded-sm bg-[#16213E] flex items-center justify-center shadow-sm">
            <GraduationCap className="w-6 h-6 text-[#FFFEFB]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Eyebrow */}
        <span className="font-mono-data text-[10px] tracking-[0.25em] uppercase text-[#B8860B] font-medium mb-2">
          SSP · Scholarship Portal
        </span>

        {/* Message */}
        <h2 className="font-serif-display text-xl sm:text-2xl font-normal text-[#16213E] mb-2">
          {message}
        </h2>

        <p className="text-xs text-[#6B6558] tracking-wide mb-6">
          Please wait while we prepare your session
        </p>

        {/* Hairline indeterminate progress bar */}
        <div className="w-36 h-[2px] bg-[#E5E0D4] rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#16213E] w-1/2 animate-indeterminate" />
        </div>

        {/* Security badge footer */}
        <div className="flex items-center gap-1.5 font-mono-data text-[10px] text-[#16213E]/50 tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2F6F4F]" strokeWidth={1.75} />
          <span>Secure Encrypted Portal</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

