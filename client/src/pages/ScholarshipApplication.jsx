import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import {
  ShieldCheck,
  FileText,
  Upload,
  Send,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  X,
  Eye,
  XCircle,
} from 'lucide-react';

const STEPS = [
  { label: 'Aadhaar Verification', icon: ShieldCheck },
  { label: 'Application Form', icon: FileText },
  { label: 'Upload Documents', icon: Upload },
  { label: 'Review & Submit', icon: Send },
];

const REQUIRED_DOCUMENTS = [
  { type: 'aadhaar', label: 'Aadhaar Card' },
  { type: 'income_certificate', label: 'Income Certificate' },
  { type: 'marksheet', label: 'Marksheet / Transcript' },
  { type: 'admission_letter', label: 'Admission Letter' },
  { type: 'bank_passbook', label: 'Bank Passbook' },
  { type: 'caste_certificate', label: 'Caste Certificate' },
];

const ScholarshipApplication = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, getUserData } = useContext(AppContent);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Step 1: Aadhaar
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  // Step 2: Application form
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
    courseName: '',
    instituteName: '',
    yearOfStudy: '',
    registrationNumber: '',
    annualFamilyIncome: '',
    bankName: '',
  });

  // Bank details (top-level, separate from formData)
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  // Step 3: Documents
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState(null);

  // Step 4: submitted
  const [submitted, setSubmitted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [applicationRejectionReason, setApplicationRejectionReason] = useState('');

  // Check existing state on load
  useEffect(() => {
    const checkExistingState = async () => {
      try {
        axios.defaults.withCredentials = true;

        // Check aadhaar status from userData
        if (userData?.aadhaarVerified) {
          setAadhaarVerified(true);
        }

        // Check existing application
        try {
          const { data } = await axios.get(backendUrl + '/api/student/application-status');
          if (data.success && data.application) {
            const app = data.application;
            setApplicationId(app._id);

            if (app.status === 'submitted' || app.status === 'verified' || app.status === 'disbursed') {
              setSubmitted(true);
              setAadhaarVerified(true);
              setCurrentStep(3);
            } else if (app.status === 'draft' || app.status === 'rejected') {
              if (app.status === 'rejected') {
                setIsRejected(true);
                setApplicationRejectionReason(app.rejectionReason || "Please review and correct your application.");
              }
              // Prefill form from saved data
              if (app.formData) {
                const saved = {};
                for (const [key, value] of Object.entries(app.formData)) {
                  saved[key] = value;
                }
                setFormData((prev) => ({ ...prev, ...saved }));
              }
              // Prefill bank details from application snapshot
              if (app.bankAccountNumber) setBankAccountNumber(app.bankAccountNumber);
              if (app.ifscCode) setIfscCode(app.ifscCode);
              if (app.accountHolderName) setAccountHolderName(app.accountHolderName);
              
              // Prefill documents
              try {
                const docsRes = await axios.get(backendUrl + '/api/student/documents');
                if (docsRes.data.success && docsRes.data.documents) {
                  const fetchedDocs = {};
                  docsRes.data.documents.forEach(d => {
                    // Only prefill if the document itself wasn't rejected, or prefill anyway so they can delete and reupload
                    fetchedDocs[d.documentType] = { url: d.cloudinaryUrl, name: `${d.documentType.replace(/_/g, " ")} document` };
                  });
                  setUploadedDocs(fetchedDocs);
                }
              } catch (e) {
                console.error("Could not fetch documents", e);
              }

              // Jump to appropriate step
              if (userData?.aadhaarVerified) {
                setCurrentStep(1);
              }
            }
          } else {
            // No application yet — go to aadhaar or form
            if (userData?.aadhaarVerified) {
              setCurrentStep(1);
            }
          }
        } catch {
          // No application found
          if (userData?.aadhaarVerified) {
            setCurrentStep(1);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (userData !== null) {
      checkExistingState();
    }
  }, [backendUrl, userData]);

  // ----- Step 1: Verify Aadhaar -----
  const handleVerifyAadhaar = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/student/verify-aadhaar', { aadhaarNumber });
      if (data.success) {
        toast.success(data.message);
        setAadhaarVerified(true);
        getUserData();
        setCurrentStep(1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Aadhaar verification failed');
    } finally {
      setLoading(false);
    }
  };

  // ----- Step 2: Save Application -----
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveApplication = async () => {
    const required = [
      'name', 'email', 'fatherName', 'dateOfBirth', 'contactNumber',
      'address', 'courseName', 'instituteName', 'annualFamilyIncome',
      'bankName',
    ];
    for (const field of required) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    if (!bankAccountNumber) { toast.error('Please fill in bank account number'); return; }
    if (!ifscCode) { toast.error('Please fill in IFSC code'); return; }
    if (!accountHolderName) { toast.error('Please fill in account holder name'); return; }

    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/student/save-application', {
        formData,
        bankAccountNumber,
        ifscCode,
        accountHolderName,
      });
      if (data.success) {
        toast.success(data.message);
        setApplicationId(data.applicationId);
        setCurrentStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  // ----- Step 3: Upload Documents -----
  const handleDocUpload = async (docType, file) => {
    if (!applicationId) {
      toast.error('Please save the application first');
      return;
    }
    setUploadingDoc(docType);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('documentType', docType);
      fd.append('applicationId', applicationId);

      const { data } = await axios.post(backendUrl + '/api/student/upload-document', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success(`${REQUIRED_DOCUMENTS.find((d) => d.type === docType)?.label} uploaded`);
        setUploadedDocs((prev) => ({
          ...prev,
          [docType]: { url: data.document.cloudinaryUrl, name: file.name },
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingDoc(null);
    }
  };

  const allDocsUploaded = REQUIRED_DOCUMENTS.every((d) => uploadedDocs[d.type]);

  // ----- Step 4: Submit -----
  const handleSubmitApplication = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/student/submit-application');
      if (data.success) {
        toast.success(data.message);
        setSubmitted(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  // ---- Loading State ----
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scholarship Application</h1>
          <p className="text-gray-500 mt-1">Complete all steps to submit your PMSSS application</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep || (index === 3 && submitted);
            const isCurrent = index === currentStep && !submitted;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center font-medium hidden sm:block ${
                      isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

          {/* ===== STEP 1: Aadhaar Verification ===== */}
          {currentStep === 0 && !aadhaarVerified && (
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
          )}

          {/* ===== STEP 2: Application Form ===== */}
          {currentStep === 1 && (
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

              <div className="flex justify-end mt-8">
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
          )}

          {/* ===== STEP 3: Upload Documents ===== */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-600" />
                Upload Required Documents
              </h2>
              <p className="text-gray-500 mb-6">All 6 documents are required before submission</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const isUploaded = !!uploadedDocs[doc.type];
                  const isUploading = uploadingDoc === doc.type;

                  return (
                    <div
                      key={doc.type}
                      className={`border-2 rounded-xl p-4 transition ${
                        isUploaded
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800 text-sm">{doc.label}</span>
                        {isUploaded && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>

                      {isUploaded ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600 truncate flex-1">
                            {uploadedDocs[doc.type].name}
                          </span>
                          <div className="flex items-center gap-2 ml-2">
                            <a
                              href={uploadedDocs[doc.type].url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() =>
                                setUploadedDocs((prev) => {
                                  const copy = { ...prev };
                                  delete copy[doc.type];
                                  return copy;
                                })
                              }
                              className="text-red-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg py-4 text-center hover:border-blue-400 transition">
                            {isUploading ? (
                              <Loader2 className="w-5 h-5 animate-spin text-blue-500 mx-auto" />
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs text-gray-500">Click to upload</span>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleDocUpload(doc.type, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!allDocsUploaded}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Review & Submit <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 4: Review & Submit ===== */}
          {currentStep === 3 && (
            <div>
              {submitted ? (
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
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipApplication;
