import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  FolderOpen,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

const DOC_LABELS = {
  aadhaar: "Aadhaar Card",
  income_certificate: "Income Certificate",
  marksheet: "Marksheet / Transcript",
  admission_letter: "Admission Letter",
  bank_passbook: "Bank Passbook",
  caste_certificate: "Caste Certificate",
};

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
    iconColor: "text-green-500",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
  },
  pending: {
    label: "Pending Verification",
    icon: Clock,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
    iconColor: "text-yellow-500",
  },
};

const ViewDocuments = () => {
  const { backendUrl } = useContext(AppContent);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/student/documents");
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [backendUrl]);

  // Stats
  const total = documents.length;
  const approved = documents.filter((d) => d.verificationStatus === "approved").length;
  const rejected = documents.filter((d) => d.verificationStatus === "rejected").length;
  const pending = documents.filter((d) => d.verificationStatus === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Documents
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View the status of all your uploaded documents
            </p>
          </div>
          <button
            onClick={fetchDocuments}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        {total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs text-green-500 uppercase tracking-wide">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approved}</p>
            </div>
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs text-yellow-500 uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            </div>
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs text-red-500 uppercase tracking-wide">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejected}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {total === 0 && (
          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Documents Uploaded
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't uploaded any documents yet. Start your scholarship
              application to upload the required documents.
            </p>
          </div>
        )}

        {/* Document Cards */}
        {total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => {
              const status = STATUS_CONFIG[doc.verificationStatus] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={doc._id}
                  className={`rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md ${status.bg} ${status.border}`}
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/80 border flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {DOC_LABELS[doc.documentType] || doc.documentType}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${status.badge}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    {/* Rejection reason */}
                    {doc.verificationStatus === "rejected" && doc.rejectionReason && (
                      <div className="mt-2 p-3 bg-red-100/60 rounded-lg border border-red-200">
                        <p className="text-xs text-red-700">
                          <strong>Reason:</strong> {doc.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Verified by */}
                    {doc.verificationStatus === "approved" && doc.verifiedBy && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified by {doc.verifiedBy.fullName}
                        {doc.verifiedAt &&
                          ` on ${new Date(doc.verifiedAt).toLocaleDateString("en-IN")}`}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-white/60 border-t flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {doc.fileFormat ? doc.fileFormat.toUpperCase() : "FILE"}
                      {doc.fileSize ? ` • ${(doc.fileSize / 1024).toFixed(0)} KB` : ""}
                    </span>
                    <a
                      href={doc.cloudinaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDocuments;
