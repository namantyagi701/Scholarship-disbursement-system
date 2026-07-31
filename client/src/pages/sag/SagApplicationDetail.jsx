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
    setActionLoading(true);
    try {
      const { data } = await axios.put(backendUrl + `/api/sag/verify/${id}`);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">Application not found.</p>
        <button onClick={() => navigate("/sag/applications")} className="mt-4 text-blue-600 hover:underline">
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/sag/applications")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </button>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-semibold text-gray-900">{student?.fullName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900">{student?.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Mobile</p>
              <p className="text-sm font-semibold text-gray-900">{student?.mobile || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Aadhaar</p>
              <p className="text-sm font-semibold text-gray-900">
                {student?.aadhaarNumber || "—"}
                {student?.aadhaarVerified && (
                  <span className="ml-2 text-green-600 text-xs">(Verified)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Data */}
      {Object.keys(formData).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="border border-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-400 text-sm">No documents uploaded</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-8 h-8 text-blue-500 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 capitalize truncate">
                      {doc.documentType?.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Status:{" "}
                      <span className={`font-medium ${
                        doc.verificationStatus === 'approved' ? 'text-green-600' :
                        doc.verificationStatus === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {doc.verificationStatus}
                      </span>
                    </p>
                    {doc.verificationStatus === 'rejected' && doc.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1">Reason: {doc.rejectionReason}</p>
                    )}
                  </div>
                  <a
                    href={doc.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-500"
                    title="View Document"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                {isActionable && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleVerifyDocument(doc._id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setCurrentDocId(doc._id);
                        setDocRejectModal(true);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="text-lg font-bold capitalize text-gray-900">{application.status}</p>
            {application.rejectionReason && (
              <p className="text-sm text-red-500 mt-1">Reason: {application.rejectionReason}</p>
            )}
          </div>

          {isActionable && (
            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                <CheckCircle className="w-4 h-4" />
                {actionLoading ? "Processing..." : "Verify & Approve"}
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Application</h3>
            <p className="text-sm text-gray-500 mb-4">
              Provide a reason for rejecting this application. The student will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Document</h3>
            <p className="text-sm text-gray-500 mb-4">
              Provide a reason for rejecting this document.
            </p>
            <textarea
              value={docRejectReason}
              onChange={(e) => setDocRejectReason(e.target.value)}
              placeholder="Enter rejection reason (e.g., blurry image)..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setDocRejectModal(false);
                  setDocRejectReason("");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectDocument}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SagApplicationDetail;
