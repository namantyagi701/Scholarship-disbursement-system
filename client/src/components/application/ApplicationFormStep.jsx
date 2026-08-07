import React from 'react';
import { FileText, XCircle, ChevronRight, Loader2 } from 'lucide-react';

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
  accountHolderName,
  setAccountHolderName,
  handleSaveApplication,
  onSaveProgress,
  loading
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" />
        Application Form
      </h2>

      {isRejected && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Your application was rejected</h3>
              <p className="text-sm text-red-700 mt-1">{applicationRejectionReason}</p>
              <p className="text-xs text-red-600 mt-2">Please correct the information below or upload the correct documents in the next step, then resubmit your application.</p>
            </div>
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            )}
          </div>
        ))}
      </div>

      {/* Bank Details — top-level fields */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onSaveProgress}
          disabled={loading}
          className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Progress'}
        </button>
        <button
          onClick={handleSaveApplication}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationFormStep;
