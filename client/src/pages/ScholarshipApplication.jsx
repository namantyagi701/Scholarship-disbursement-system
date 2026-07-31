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
  Loader2,
} from 'lucide-react';

import AadhaarStep from '../components/application/AadhaarStep';
import ApplicationFormStep from '../components/application/ApplicationFormStep';
import DocumentUploadStep from '../components/application/DocumentUploadStep';
import ReviewSubmitStep from '../components/application/ReviewSubmitStep';

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

          {currentStep === 0 && !aadhaarVerified && (
            <AadhaarStep
              aadhaarNumber={aadhaarNumber}
              setAadhaarNumber={setAadhaarNumber}
              handleVerifyAadhaar={handleVerifyAadhaar}
              loading={loading}
            />
          )}

          {currentStep === 1 && (
            <ApplicationFormStep
              isRejected={isRejected}
              applicationRejectionReason={applicationRejectionReason}
              formData={formData}
              handleFormChange={handleFormChange}
              bankAccountNumber={bankAccountNumber}
              setBankAccountNumber={setBankAccountNumber}
              ifscCode={ifscCode}
              setIfscCode={setIfscCode}
              accountHolderName={accountHolderName}
              setAccountHolderName={setAccountHolderName}
              handleSaveApplication={handleSaveApplication}
              loading={loading}
            />
          )}

          {currentStep === 2 && (
            <DocumentUploadStep
              REQUIRED_DOCUMENTS={REQUIRED_DOCUMENTS}
              uploadedDocs={uploadedDocs}
              uploadingDoc={uploadingDoc}
              handleDocUpload={handleDocUpload}
              setUploadedDocs={setUploadedDocs}
              setCurrentStep={setCurrentStep}
              allDocsUploaded={allDocsUploaded}
            />
          )}

          {currentStep === 3 && (
            <ReviewSubmitStep
              submitted={submitted}
              navigate={navigate}
              formData={formData}
              REQUIRED_DOCUMENTS={REQUIRED_DOCUMENTS}
              bankAccountNumber={bankAccountNumber}
              ifscCode={ifscCode}
              accountHolderName={accountHolderName}
              setCurrentStep={setCurrentStep}
              handleSubmitApplication={handleSubmitApplication}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipApplication;
