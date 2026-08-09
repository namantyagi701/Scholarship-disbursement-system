import React, { useState } from 'react';
import { FileText, XCircle, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApplicationFormStep = ({
  isRejected,
  applicationRejectionReason,
  formData,
  handleFormChange,
  bankAccountNumber,
  setBankAccountNumber,
  ifscCode,
  setIfscCode,
  accountHolderName,
  setAccountHolderName,
  handleSaveApplication,
  onSaveProgress,
  loading
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveClick = async () => {
    const success = await onSaveProgress();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    }
  };

  return (
    <div>
      <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#16213E] mb-6 flex items-center gap-3">
        <FileText className="w-6 h-6 text-[#16213E]" strokeWidth={1.5} />
        Application Form
      </h2>

      {isRejected && (
        <div className="mb-8 pl-4 border-l-2" style={{ borderColor: "#8B2E2E" }}>
          <p className="text-xs font-mono-data uppercase tracking-wide text-[#8B2E2E] mb-1">
            Application Rejected
          </p>
          <p className="text-sm text-[#5C3A3A] mb-2">
            {applicationRejectionReason}
          </p>
          <p className="text-xs text-[#8A8374]">
            Please correct the information below or upload the correct documents in the next step, then resubmit your application.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'fatherName', label: "Father's Name", type: 'text', required: true },
          { name: 'motherName', label: "Mother's Name", type: 'text' },
          { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
          { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
          { name: 'contactNumber', label: 'Contact Number', type: 'tel', required: true },
          { name: 'address', label: 'Address', type: 'text', required: true },
          { name: 'state', label: 'State', type: 'text' },
          { name: 'district', label: 'District', type: 'text' },
          { name: 'pincode', label: 'Pincode', type: 'text' },
          { name: 'courseName', label: 'Course Name', type: 'text', required: true },
          { name: 'instituteName', label: 'Institute Name', type: 'text', required: true },
          { name: 'yearOfStudy', label: 'Year of Study', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'] },
          { name: 'registrationNumber', label: 'Registration Number', type: 'text' },
          { name: 'annualFamilyIncome', label: 'Annual Family Income (₹)', type: 'number', required: true },
          { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <div className="relative group">
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-[#DCD6C8] rounded-sm text-sm focus:outline-none transition relative z-10 bg-transparent"
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16213E] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-b-sm z-20 pointer-events-none" />
              </div>
            ) : (
              <div className="relative group">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-[#DCD6C8] rounded-sm text-sm focus:outline-none transition relative z-10 bg-transparent"
                />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16213E] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-b-sm z-20 pointer-events-none" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bank Details — top-level fields */}
      <div className="mt-8 pt-6 border-t border-[#DCD6C8]">
        <h3 className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#8A8374] mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#DCD6C8] rounded-sm text-sm focus:outline-none transition relative z-10 bg-transparent"
              />
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16213E] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-b-sm z-20 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3A3A3A] mb-1">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 border border-[#DCD6C8] rounded-sm text-sm focus:outline-none transition relative z-10 bg-transparent"
              />
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16213E] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-b-sm z-20 pointer-events-none" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#3A3A3A] mb-1">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none transition relative z-10 bg-transparent"
              />
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#16213E] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-b-lg z-20 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={handleSaveClick}
          disabled={loading}
          className="px-6 py-3 border border-[#16213E] text-[#16213E] font-medium rounded-sm hover:bg-[#16213E]/5 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Save Progress'}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#2F6F4F]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={handleSaveApplication}
          disabled={loading}
          className="px-8 py-3 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] font-medium rounded-sm transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationFormStep;
