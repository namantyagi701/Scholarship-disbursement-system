import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import {
  CheckCircle,
  Clock,
  FileText,
  CreditCard,
  AlertCircle,
  Eye,
  Upload,
  XCircle,
  ShieldCheck,
  Loader2,
  ArrowRight,
  User,
  GraduationCap,
  IndianRupee,
  BadgeCheck,
  FilePlus,
} from "lucide-react";

// ---------- helpers ----------
const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  verified: {
    label: "Verified by SAG",
    color: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  disbursed: {
    label: "Disbursed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const progressMap = {
  draft: 20,
  submitted: 45,
  verified: 70,
  rejected: 45,
  disbursed: 100,
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContent);

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [payment, setPayment] = useState(null);
  const [hasApplication, setHasApplication] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        axios.defaults.withCredentials = true;

        // Fetch application status
        try {
          const { data } = await axios.get(
            backendUrl + "/api/student/application-status"
          );
          if (data.success && data.application) {
            setApplication(data.application);
            setHasApplication(true);

            // Fetch payment details if disbursed
            if (data.application.status === "disbursed") {
              try {
                const payRes = await axios.get(
                  backendUrl + "/api/student/payment-details"
                );
                if (payRes.data.success) {
                  setPayment(payRes.data);
                }
              } catch {
                // not yet disbursed
              }
            }
          }
        } catch {
          // no application yet
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  // ---- Derived data ----
  const status = application?.status || "draft";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const progress = progressMap[status] || 0;
  const formData = application?.formData
    ? Object.fromEntries(
        application.formData instanceof Map
          ? application.formData
          : Object.entries(application.formData)
      )
    : {};

  // timeline steps
  const timelineSteps = [
    {
      label: "Aadhaar Verified",
      done: userData?.aadhaarVerified,
      icon: ShieldCheck,
    },
    {
      label: "Application Saved",
      done: hasApplication,
      icon: FileText,
    },
    {
      label: "Application Submitted",
      done: ["submitted", "verified", "disbursed"].includes(status),
      icon: BadgeCheck,
    },
    {
      label: "SAG Verification",
      done: ["verified", "disbursed"].includes(status),
      active: status === "submitted",
      rejected: status === "rejected",
      icon: Eye,
    },
    {
      label: "Payment Disbursed",
      done: status === "disbursed",
      active: status === "verified",
      icon: IndianRupee,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ---- Welcome Banner ---- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Welcome back, {userData?.fullName || "Student"}!
                </h1>
                <p className="text-blue-100 text-sm mt-0.5">
                  Here's an overview of your PMSSS scholarship activity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- No application yet ---- */}
        {!hasApplication && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <FilePlus className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Application Found
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't started your scholarship application yet. Begin by
              verifying your Aadhaar and filling out the application form.
            </p>
            <button
              onClick={() => navigate("/scholarship-application")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              Start Application <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ---- Main dashboard content (only if application exists) ---- */}
        {hasApplication && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status */}
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">Status</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border ${statusCfg.color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                  {statusCfg.label}
                </span>
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500">Progress</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{progress}%</h3>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Aadhaar */}
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Aadhaar</p>
                </div>
                {userData?.aadhaarVerified ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-yellow-600 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4" /> Not Verified
                  </span>
                )}
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-500">Payment</p>
                </div>
                {status === "disbursed" && payment ? (
                  <span className="text-emerald-600 font-bold text-lg">
                    Disbursed
                  </span>
                ) : (
                  <span className="text-gray-400 font-medium text-sm">
                    {status === "verified" ? "Processing" : "Pending"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* ---- Left: Application + Timeline ---- */}
              <div className="lg:col-span-2 space-y-6">
                {/* Application Details Card */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Application Details
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ID: {application._id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusCfg.color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                      />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Form data summary */}
                  {Object.keys(formData).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(formData).map(([key, value]) =>
                        value ? (
                          <div key={key}>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {value}
                            </p>
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No form data saved yet.
                    </p>
                  )}

                  {/* Rejection reason */}
                  {status === "rejected" && application.rejectionReason && (
                    <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          {application.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SAG verified info */}
                  {status === "verified" && application.sagVerifiedBy && (
                    <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">
                          Verified by SAG
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          {application.sagVerifiedBy.fullName} (
                          {application.sagVerifiedBy.email})
                          {application.sagVerifiedAt &&
                            ` on ${new Date(
                              application.sagVerifiedAt
                            ).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">
                    Application Timeline
                  </h2>
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

                    <div className="space-y-6">
                      {timelineSteps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                          <div key={i} className="relative flex items-start gap-4 pl-1">
                            <div
                              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                step.done
                                  ? "bg-green-500 text-white"
                                  : step.rejected
                                  ? "bg-red-500 text-white"
                                  : step.active
                                  ? "bg-blue-500 text-white animate-pulse"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {step.done ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : step.rejected ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="pt-1">
                              <p
                                className={`text-sm font-medium ${
                                  step.done
                                    ? "text-gray-800"
                                    : step.rejected
                                    ? "text-red-600"
                                    : step.active
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                                {step.rejected && " — Rejected"}
                              </p>
                              {step.done && (
                                <p className="text-xs text-gray-400">Completed</p>
                              )}
                              {step.active && !step.done && (
                                <p className="text-xs text-blue-400">
                                  In progress...
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- Right Panel ---- */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => navigate("/scholarship-application")}
                      className="w-full flex items-center gap-3 text-sm border border-gray-200 rounded-xl px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {hasApplication
                          ? "View / Edit Application"
                          : "Start Application"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>

                    <button
                      onClick={() => navigate("/view-docs")}
                      className="w-full flex items-center gap-3 text-sm border border-gray-200 rounded-xl px-4 py-3 hover:bg-green-50 hover:border-green-200 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition">
                        <Eye className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        View Documents
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  </div>
                </div>

                {/* Payment Card */}
                <div
                  className={`rounded-2xl border shadow-sm p-5 ${
                    status === "disbursed"
                      ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard
                      className={`w-5 h-5 ${
                        status === "disbursed"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    />
                    <h3 className="font-bold text-gray-900">Payment Info</h3>
                  </div>
                  {status === "disbursed" && payment ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="text-sm font-mono font-semibold text-gray-800">
                          {payment.transactionId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Disbursed On</p>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(payment.disbursedAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {status === "verified"
                        ? "Payment is being processed..."
                        : "Payment will be processed after SAG verification."}
                    </p>
                  )}
                </div>

                {/* Profile Summary */}
                <div className="bg-white rounded-2xl border shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Your Profile</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {userData?.fullName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {userData?.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Mobile
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {userData?.mobile || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Aadhaar
                      </p>
                      <p className="text-sm font-medium">
                        {userData?.aadhaarVerified ? (
                          <span className="text-green-600 inline-flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-yellow-600 inline-flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;