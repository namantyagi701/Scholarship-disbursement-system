import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import StatusStamp from "../../components/ui/StatusStamp";

const SagApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [docRejectModal, setDocRejectModal] = useState(false);
  const [docRejectReason, setDocRejectReason] = useState("");
  const [currentDocId, setCurrentDocId] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + `/api/sag/application/${id}`);
      if (data.success) {
        setApplication(data.application);
        setDocuments(data.documents || []);
      }
    } catch (error) {
      toast.error("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid scholarship amount");
      return;
    }
    setActionLoading(true);
    try {
      const { data } = await axios.put(backendUrl + `/api/sag/verify/${id}`, { amount: parsedAmount });
      if (data.success) {
        toast.success(data.message);
        setApplication(data.application);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setActionLoading(true);
    try {
      const { data } = await axios.put(backendUrl + `/api/sag/reject/${id}`, { reason: rejectReason });
      if (data.success) {
        toast.success(data.message);
        setApplication(data.application);
        setShowRejectModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyDocument = async (docId) => {
    try {
      const { data } = await axios.put(backendUrl + `/api/sag/document/verify/${docId}`);
      if (data.success) {
        toast.success(data.message);
        setDocuments((prevDocs) =>
          prevDocs.map((doc) => (doc._id === docId ? data.document : doc))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify document");
    }
  };

  const handleRejectDocument = async () => {
    if (!docRejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      const { data } = await axios.put(backendUrl + `/api/sag/document/reject/${currentDocId}`, { reason: docRejectReason });
      if (data.success) {
        toast.success(data.message);
        setDocuments((prevDocs) =>
          prevDocs.map((doc) => (doc._id === currentDocId ? data.document : doc))
        );
        setDocRejectModal(false);
        setDocRejectReason("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject document");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAF8F3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16213E]" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] px-4 py-12 text-center">
        <p className="text-[#16213E] text-lg font-mono-data">Application not found.</p>
        <button onClick={() => navigate("/sag/applications")} className="mt-4 text-[#B8860B] hover:underline font-mono-data uppercase text-sm">
          Back to Applications
        </button>
      </div>
    );
  }

  const student = application.student;
  const formData = application.formData && typeof application.formData === "object"
    ? (application.formData instanceof Map ? Object.fromEntries(application.formData) : application.formData)
    : {};
  const isActionable = application.status === "submitted";
  const allDocsApproved = documents.length > 0 && documents.every(doc => doc.verificationStatus === "approved");

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#16213E] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/sag/applications")}
          className="flex items-center gap-2 text-[#16213E]/60 hover:text-[#16213E] mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </button>

        {/* Page Header block */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] px-8 py-10 mb-8 rounded-sm text-center">
          <p className="font-mono-data text-xs text-[#B8860B] tracking-widest uppercase mb-3">PMSSS · SAG Review</p>
          <h1 className="font-serif-display text-4xl text-[#16213E]">{student?.fullName || "Application Detail"}</h1>
          <p className="font-mono-data text-sm text-[#16213E]/60 mt-3">ID: {application._id || id}</p>
        </div>

        {/* Student Info Card */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] p-6 mb-6 rounded-sm relative">
          <div className="absolute top-6 right-6 hidden sm:block scale-90 origin-top-right">
             <StatusStamp status={application.status} />
          </div>
          <h2 className="text-xl font-serif-display text-[#16213E] mb-4">Student Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Full Name</p>
              <p className="text-sm font-medium text-[#16213E]">{student?.fullName || "—"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-[#16213E]">{student?.email || "—"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Mobile</p>
              <p className="text-sm font-medium text-[#16213E]">{student?.mobile || "—"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Aadhaar</p>
              <p className="text-sm font-medium text-[#16213E]">
                {student?.aadhaarNumber || "—"}
                {student?.aadhaarVerified && (
                  <span className="ml-2 text-[#2F6F4F] font-mono-data text-xs">(Verified)</span>
                )}
              </p>
            </div>
          </div>
          <div className="mt-6 sm:hidden scale-90 origin-top-left">
            <StatusStamp status={application.status} />
          </div>
        </div>

        {/* Application Form Data */}
        {Object.keys(formData).length > 0 && (
          <div className="bg-[#FFFEFB] border border-[#DCD6C8] p-6 mb-6 rounded-sm">
            <h2 className="text-xl font-serif-display text-[#16213E] mb-4">Application Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="border-b border-[#DCD6C8] pb-2">
                  <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider mb-1">{key.replace(/_/g, " ")}</p>
                  <p className="text-sm font-medium text-[#16213E]">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] p-6 mb-6 rounded-sm">
          <h2 className="text-xl font-serif-display text-[#16213E] mb-4">Uploaded Documents</h2>
          {documents.length === 0 ? (
            <p className="text-[#16213E]/50 text-sm font-mono-data">No documents uploaded</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex flex-col p-4 border border-[#DCD6C8] rounded-sm bg-[#FFFEFB]"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-[#16213E]/50 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#16213E] capitalize truncate mb-3">
                        {doc.documentType?.replace(/_/g, " ")}
                      </p>
                      
                      <div className="mb-2 scale-75 origin-top-left -ml-1">
                        <StatusStamp
                          status={doc.verificationStatus === 'approved' ? 'verified' : doc.verificationStatus}
                          label={doc.verificationStatus}
                        />
                      </div>
                      
                      {doc.verificationStatus === 'rejected' && doc.rejectionReason && (
                        <p className="text-xs text-[#8B2E2E] mt-1 font-mono-data">Reason: {doc.rejectionReason}</p>
                      )}
                      {/* OCR match indicator */}
                      {doc.documentType === 'aadhaar' && doc.ocrNameMatchScore != null && (
                        <div className="mt-2 font-mono-data text-[11px] leading-tight">
                          {doc.ocrNameMatchScore >= 0.8 ? (
                            <p className="text-[#2F6F4F]">✓ OCR: name matches application</p>
                          ) : (
                            <>
                              <p className="text-[#B8860B]">⚠ OCR: extracted name may not match — verify manually</p>
                              {doc.ocrExtractedText && (
                                <p className="text-[#16213E]/50 mt-1 truncate" title={doc.ocrExtractedText}>
                                  OCR text: {doc.ocrExtractedText.substring(0, 120)}…
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <a
                      href={doc.cloudinaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#16213E]/40 hover:text-[#B8860B] transition-colors"
                      title="View Document"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {isActionable && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-[#DCD6C8]">
                      <button
                        onClick={() => handleVerifyDocument(doc._id)}
                        className="flex-1 px-3 py-1.5 text-xs font-medium border border-[#2F6F4F] text-[#2F6F4F] hover:bg-[#2F6F4F] hover:text-[#FFFEFB] rounded-sm transition-colors uppercase tracking-wider"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setCurrentDocId(doc._id);
                          setDocRejectModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-medium border border-[#8B2E2E] text-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-[#FFFEFB] rounded-sm transition-colors uppercase tracking-wider"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] p-6 rounded-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider mb-1">Final Action</p>
              {application.rejectionReason && (
                <p className="text-sm text-[#8B2E2E] mt-1 font-mono-data">Reason: {application.rejectionReason}</p>
              )}
            </div>

            {isActionable && (
              <div className="flex flex-col gap-4 w-full sm:w-auto">
                {/* Scholarship Amount Input */}
                <div className="flex flex-col gap-1">
                  <label className="block text-xs font-mono-data text-[#16213E]/70 uppercase tracking-wider">
                    Scholarship Amount (₹) <span className="text-[#8B2E2E]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full sm:w-48 px-0 py-2 border-0 border-b border-[#DCD6C8] bg-transparent text-sm focus:outline-none focus:border-[#16213E] focus:ring-0 font-mono-data"
                  />
                </div>

                {/* Document approval warning */}
                {!allDocsApproved && (
                  <p className="text-xs font-mono-data text-[#16213E]/70 border border-[#DCD6C8] px-3 py-2 bg-transparent rounded-sm">
                    All documents must be individually approved before the application can be verified.
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={actionLoading || !allDocsApproved}
                    title={!allDocsApproved ? "Approve all documents first" : ""}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] rounded-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {actionLoading ? "Processing..." : "Verify & Approve"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-[#8B2E2E] text-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-[#FFFEFB] rounded-sm font-medium transition-colors disabled:opacity-50 uppercase tracking-wider text-xs"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm w-full max-w-md p-6">
              <h3 className="text-xl font-serif-display text-[#16213E] mb-2">Reject Application</h3>
              <p className="text-sm font-mono-data text-[#16213E]/60 mb-4">
                Provide a reason for rejecting this application. The student will be notified.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                className="w-full border border-[#DCD6C8] bg-transparent rounded-sm p-3 text-sm focus:outline-none focus:border-[#16213E] resize-none font-mono-data"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-xs font-mono-data uppercase tracking-wider text-[#16213E]/60 hover:text-[#16213E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#8B2E2E] hover:bg-[#7a2828] text-[#FFFEFB] rounded-sm text-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Doc Reject Modal */}
        {docRejectModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm w-full max-w-md p-6">
              <h3 className="text-xl font-serif-display text-[#16213E] mb-2">Reject Document</h3>
              <p className="text-sm font-mono-data text-[#16213E]/60 mb-4">
                Provide a reason for rejecting this document.
              </p>
              <textarea
                value={docRejectReason}
                onChange={(e) => setDocRejectReason(e.target.value)}
                placeholder="Enter rejection reason (e.g., blurry image)..."
                rows={4}
                className="w-full border border-[#DCD6C8] bg-transparent rounded-sm p-3 text-sm focus:outline-none focus:border-[#16213E] resize-none font-mono-data"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setDocRejectModal(false);
                    setDocRejectReason("");
                  }}
                  className="px-4 py-2 text-xs font-mono-data uppercase tracking-wider text-[#16213E]/60 hover:text-[#16213E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectDocument}
                  className="px-5 py-2 bg-[#8B2E2E] hover:bg-[#7a2828] text-[#FFFEFB] rounded-sm text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SagApplicationDetail;
