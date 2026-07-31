import React from 'react';
import { CheckCircle, Send, ChevronLeft, Loader2 } from 'lucide-react';

const ReviewSubmitStep = ({
  submitted,
  navigate,
  formData,
  REQUIRED_DOCUMENTS,
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
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">
          Your application has been submitted successfully and is under review.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Send className="w-6 h-6 text-blue-600" />
        Review & Submit
      </h2>

      {/* Summary */}
      <div className="space-y-6">
        {/* Aadhaar */}
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold text-gray-800">Aadhaar Verified</p>
            <p className="text-sm text-gray-500">Your identity has been verified</p>
          </div>
        </div>

        {/* Application Summary */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-3">Application Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(formData).map(([key, value]) =>
              value ? (
                <div key={key} className="flex gap-2">
                  <span className="text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="text-gray-800 font-medium">{value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Bank Details Summary */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-gray-800 mb-3">Bank Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500">Account Number:</span>
              <span className="text-gray-800 font-medium font-mono">{bankAccountNumber}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500">IFSC Code:</span>
              <span className="text-gray-800 font-medium font-mono">{ifscCode}</span>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <span className="text-gray-500">Account Holder:</span>
              <span className="text-gray-800 font-medium">{accountHolderName}</span>
            </div>
          </div>
        </div>

        {/* Documents Summary */}
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <h3 className="font-semibold text-gray-800 mb-3">Uploaded Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <div key={doc.type} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">{doc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={handleSubmitApplication}
          disabled={loading}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
