import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Eye,
  CheckCircle,
  XCircle,
  IndianRupee,
  Loader2,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  { key: "submitted", label: "Submitted", icon: Send },
  { key: "verified", label: "SAG Verified", icon: Eye },
  { key: "disbursed", label: "Disbursed", icon: IndianRupee },
];

const ApplicationStatus = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(
          backendUrl + "/api/student/application-status"
        );
        if (data.success && data.application) {
          setApplication(data.application);

          if (data.application.status === "disbursed") {
            try {
              const payRes = await axios.get(
                backendUrl + "/api/student/payment-details"
              );
              if (payRes.data.success) setPayment(payRes.data);
            } catch {}
          }
        }
      } catch {
        // no application
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // No application or still in draft
  if (!application || application.status === "draft") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Submitted Application
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Submit your application first to track its status here.
          </p>
          <button
            onClick={() => navigate("/scholarship-application")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
          >
            Go to Application <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const status = application.status;
  const isRejected = status === "rejected";

  // Map status to completed step index
  const stepIndex = isRejected
    ? 0
    : status === "submitted"
    ? 0
    : status === "verified"
    ? 1
    : status === "disbursed"
    ? 2
    : -1;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Status
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ID: {application._id}
          </p>
        </div>

        {/* Status Badge */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Current Status</p>
            {isRejected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
                <XCircle className="w-4 h-4" /> Rejected
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border ${
                  status === "disbursed"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : status === "verified"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-blue-100 text-blue-700 border-blue-200"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {status === "submitted"
                  ? "Submitted — Under Review"
                  : status === "verified"
                  ? "Verified by SAG"
                  : "Disbursed"}
              </span>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Progress
          </h2>

          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const done = i <= stepIndex && !isRejected;
              const current = i === stepIndex && !isRejected;
              const Icon = step.icon;

              return (
                <div key={step.key} className="relative flex gap-4">
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`absolute left-4 top-9 w-0.5 h-full ${
                        i < stepIndex && !isRejected
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      done
                        ? "bg-green-500 text-white"
                        : current
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {done && !current ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p
                      className={`text-sm font-medium ${
                        done
                          ? "text-gray-800"
                          : current
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {/* Extra info per step */}
                    {step.key === "submitted" && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(application.updatedAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </p>
                    )}
                    {step.key === "verified" &&
                      done &&
                      application.sagVerifiedBy && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          By {application.sagVerifiedBy.fullName}
                          {application.sagVerifiedAt &&
                            ` • ${new Date(
                              application.sagVerifiedAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}`}
                        </p>
                      )}
                    {step.key === "disbursed" && done && payment && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Txn: {payment.transactionId}
                      </p>
                    )}
                    {step.key === "verified" && current && (
                      <p className="text-xs text-blue-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting SAG review
                      </p>
                    )}
                    {step.key === "disbursed" &&
                      status === "verified" &&
                      i === 2 && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Payment processing
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rejection Card */}
        {isRejected && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 text-sm">
                  Application Rejected
                </p>
                {application.rejectionReason && (
                  <p className="text-sm text-red-600 mt-1">
                    {application.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Card */}
        {status === "disbursed" && payment && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Payment Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="text-sm font-mono font-semibold text-gray-800">
                  {payment.transactionId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Disbursed On</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(payment.disbursedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
