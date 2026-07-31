import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

const AadhaarStep = ({ aadhaarNumber, setAadhaarNumber, handleVerifyAadhaar, loading }) => {
  return (
    <div className="max-w-md mx-auto text-center">
      <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Aadhaar</h2>
      <p className="text-gray-500 mb-6">
        Enter your 12-digit Aadhaar number to proceed with the application
      </p>

      <input
        type="text"
        maxLength={12}
        value={aadhaarNumber}
        onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
        placeholder="Enter 12-digit Aadhaar number"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 transition mb-6"
      />

      <button
        onClick={handleVerifyAadhaar}
        disabled={loading || aadhaarNumber.length !== 12}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
        {loading ? 'Verifying...' : 'Verify Aadhaar'}
      </button>
    </div>
  );
};

export default AadhaarStep;
