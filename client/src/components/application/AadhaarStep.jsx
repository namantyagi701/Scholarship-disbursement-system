import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

const AadhaarStep = ({ aadhaarNumber, setAadhaarNumber, handleVerifyAadhaar, loading }) => {
  return (
    <div className="max-w-md mx-auto text-center pt-4">
      <ShieldCheck className="w-16 h-16 text-[#16213E] mx-auto mb-4" strokeWidth={1.5} />
      <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#16213E] mb-2">Verify Your Aadhaar</h2>
      <p className="text-[#6B6558] mb-8">
        Enter your 12-digit Aadhaar number to proceed with the application
      </p>

      <div className="relative group mb-8">
        <input
          type="text"
          maxLength={12}
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 12-digit Aadhaar number"
          className="w-full px-4 py-3 border border-[#DCD6C8] rounded-sm text-center text-lg tracking-widest focus:outline-none transition relative z-10 bg-transparent"
        />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16213E] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-b-sm z-20 pointer-events-none" />
      </div>

      <button
        onClick={handleVerifyAadhaar}
        disabled={loading || aadhaarNumber.length !== 12}
        className="w-full py-3.5 bg-[#16213E] hover:bg-[#0F1729] text-white font-medium rounded-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
        {loading ? 'Verifying...' : 'Verify Aadhaar'}
      </button>
    </div>
  );
};

export default AadhaarStep;
