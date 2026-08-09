import React from 'react';
import { CheckCircle, Send, ChevronLeft, Loader2 } from 'lucide-react';

const ReviewSubmitStep = ({
  submitted,
  navigate,
  formData,
  REQUIRED_DOCUMENTS,
  uploadedDocs = {},
  bankAccountNumber,
  ifscCode,
  accountHolderName,
  setCurrentStep,
  handleSubmitApplication,
  loading
}) => {
  if (submitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="w-20 h-20 text-[#2F6F4F] mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#16213E] mb-2">Application Submitted!</h2>
        <p className="text-[#6B6558] mb-8">
          Your application has been submitted successfully and is under review.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3.5 bg-[#16213E] hover:bg-[#0F1729] text-white font-medium rounded-sm shadow-sm transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#16213E] mb-6 flex items-center gap-3">
        <Send className="w-6 h-6 text-[#16213E]" strokeWidth={1.5} />
        Review & Submit
      </h2>

      {/* Summary */}
      <div className="space-y-6">
        {/* Aadhaar */}
        <div className="flex items-center gap-3 p-4 bg-[#FAF8F3] rounded-sm border border-[#DCD6C8]">
          <CheckCircle className="w-5 h-5 text-[#2F6F4F] shrink-0" />
          <div>
            <p className="font-mono-data text-xs tracking-wide uppercase text-[#2F6F4F] mb-0.5">Aadhaar Verified</p>
            <p className="text-xs text-[#8A8374]">Your identity has been verified</p>
          </div>
        </div>

        {/* Application Summary */}
        <div className="p-5 bg-[#FAF8F3] rounded-sm border border-[#DCD6C8]">
          <h3 className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#8A8374] mb-4">Application Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
            {Object.entries(formData).map(([key, value]) =>
              value ? (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8374] font-mono-data mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="text-[#16213E] font-medium">{value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Bank Details Summary */}
        <div className="p-5 bg-[#FAF8F3] rounded-sm border border-[#DCD6C8]">
          <h3 className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#8A8374] mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8374] font-mono-data mb-1">Account Number:</span>
              <span className="text-[#16213E] font-medium font-mono-data text-base">{bankAccountNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8374] font-mono-data mb-1">IFSC Code:</span>
              <span className="text-[#16213E] font-medium font-mono-data text-base">{ifscCode}</span>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8374] font-mono-data mb-1">Account Holder:</span>
              <span className="text-[#16213E] font-medium">{accountHolderName}</span>
            </div>
          </div>
        </div>

        {/* Documents Summary */}
        <div className="p-5 bg-[#FAF8F3] rounded-sm border border-[#DCD6C8]">
          <h3 className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#8A8374] mb-4">Uploaded Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const isUploaded = !!uploadedDocs[doc.type];
              if (doc.optional && !isUploaded) return null;
              
              return (
                <div key={doc.type} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2F6F4F]" />
                  <span className="text-[#16213E] font-medium">{doc.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-[#DCD6C8] text-[#16213E] font-medium rounded-sm hover:bg-[#FAF8F3] transition flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleSubmitApplication}
          disabled={loading}
          className="px-8 py-3 bg-[#2F6F4F] hover:bg-[#205138] text-[#FFFEFB] font-medium rounded-sm shadow-sm transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
