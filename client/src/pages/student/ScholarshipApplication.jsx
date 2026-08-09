import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Upload,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import AadhaarStep from '../../components/application/AadhaarStep';
import ApplicationFormStep from '../../components/application/ApplicationFormStep';
import DocumentUploadStep from '../../components/application/DocumentUploadStep';
import ReviewSubmitStep from '../../components/application/ReviewSubmitStep';

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
  { type: 'caste_certificate', label: 'Caste Certificate', optional: true },
];

const ScholarshipApplication = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, getUserData } = useContext(AppContent);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Framer motion state for steps
  const prevStepRef = useRef(currentStep);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (currentStep > prevStepRef.current) {
      setDirection(1);
    } else if (currentStep < prevStepRef.current) {
      setDirection(-1);
    }
    prevStepRef.current = currentStep;
  }, [currentStep]);

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
              let fetchedDocsLocal = {};
              try {
                const docsRes = await axios.get(backendUrl + '/api/student/documents');
                if (docsRes.data.success && docsRes.data.documents) {
                  docsRes.data.documents
                    .filter(d => d.application === app._id)
                    .forEach(d => {
                      fetchedDocsLocal[d.documentType] = { url: d.cloudinaryUrl, name: `${d.documentType.replace(/_/g, " ")} document` };
                  });
                  setUploadedDocs(fetchedDocsLocal);
                }
              } catch (e) {
                console.error("Could not fetch documents", e);
              }

              // Pre-fill toast
              const isAutoCreated = app.status === 'draft' && 
                                    app.createdAt && 
                                    (new Date() - new Date(app.createdAt)) < 120000 &&
                                    app.formData && Object.keys(app.formData).length > 0;
              if (isAutoCreated) {
                  toast.info("We've pre-filled some details from your previous scholarship application — please review and update anything that's changed.");
              }

              // Jump to appropriate step
              if (userData?.aadhaarVerified) {
                const hasForm = app.formData && ['name', 'email', 'fatherName', 'dateOfBirth', 'contactNumber', 'address', 'courseName', 'instituteName', 'annualFamilyIncome', 'bankName'].every(k => app.formData[k]);
                const hasBank = app.bankAccountNumber && app.ifscCode && app.accountHolderName;
                const hasAllDocs = REQUIRED_DOCUMENTS.every(d => d.optional || fetchedDocsLocal[d.type]);

                if (hasAllDocs) {
                  setCurrentStep(3);
                } else if (hasForm && hasBank) {
                  setCurrentStep(2);
                } else {
                  setCurrentStep(1);
                }
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

  const handleSaveApplication = async (isDraftSave = false) => {
    if (!isDraftSave) {
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
    }

    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/student/save-application', {
        formData,
        bankAccountNumber,
        ifscCode,
        accountHolderName,
      });
      if (data.success) {
        if (isDraftSave) {
          toast.success("Progress saved");
          return true;
        } else {
          toast.success(data.message);
          setApplicationId(data.applicationId);
          setCurrentStep(2);
          return true;
        }
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save application');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ----- Step 3: Upload Documents -----
  const handleDocUpload = async (docType, file, ocrResult = null) => {
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

      // Attach OCR results for Aadhaar image uploads
      if (docType === 'aadhaar' && ocrResult) {
        fd.append('ocrExtractedText', (ocrResult.text || '').substring(0, 500));
        fd.append('ocrNameMatchScore', String(ocrResult.nameScore ?? 0));
      }

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

  const allDocsUploaded = REQUIRED_DOCUMENTS.every((d) => d.optional || uploadedDocs[d.type]);

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16213E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-2">
            PMSSS &middot; Applicant Portal
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#16213E]">Scholarship Application</h1>
          <p className="text-[#6B6558] mt-2">Complete all steps to submit your PMSSS application</p>
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 font-serif-display text-sm ${isCompleted
                        ? 'bg-[#16213E] border-[#16213E] text-[#FFFEFB]'
                        : isCurrent
                          ? 'bg-transparent border-[#B8860B] text-[#B8860B]'
                          : 'bg-[#FFFEFB] border-[#DCD6C8] text-[#B7B0A0]'
                      }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center font-medium hidden sm:block ${isCompleted ? 'text-[#16213E]' : isCurrent ? 'text-[#B8860B]' : 'text-[#B7B0A0]'
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-[1px] mx-2 bg-[#DCD6C8] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-[#16213E] origin-left"
                      initial={false}
                      animate={{ scaleX: index < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div className="bg-[#FFFEFB] rounded-sm border border-[#DCD6C8] p-6 sm:p-8 overflow-hidden shadow-sm">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={{
                enter: (dir) => ({
                  x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.3, ease: 'easeOut' }
                },
                exit: (dir) => ({
                  x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
                  opacity: 0,
                  transition: { duration: 0.2, ease: 'easeIn' }
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
            >

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
              handleSaveApplication={() => handleSaveApplication(false)}
              onSaveProgress={() => handleSaveApplication(true)}
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
              formData={formData}
              handleSaveApplication={() => handleSaveApplication(true)}
            />
          )}

          {currentStep === 3 && (
            <ReviewSubmitStep
              submitted={submitted}
              navigate={navigate}
              formData={formData}
              REQUIRED_DOCUMENTS={REQUIRED_DOCUMENTS}
              uploadedDocs={uploadedDocs}
              bankAccountNumber={bankAccountNumber}
              ifscCode={ifscCode}
              accountHolderName={accountHolderName}
              setCurrentStep={setCurrentStep}
              handleSubmitApplication={handleSubmitApplication}
              loading={loading}
            />
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipApplication;
