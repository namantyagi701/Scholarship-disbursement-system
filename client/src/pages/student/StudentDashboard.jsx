import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import {
  CheckCircle2,
  FileText,
  Eye,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  IndianRupee,
  Loader2,
  FilePlus,
  XCircle,
} from "lucide-react";

import StatusStamp from "../../components/ui/StatusStamp";
import LedgerRow from "../../components/ui/LedgerRow";

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

        try {
          const { data } = await axios.get(
            backendUrl + "/api/student/application-status"
          );
          if (data.success && data.application) {
            setApplication(data.application);
            setHasApplication(true);

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
  const formData = application?.formData
    ? Object.fromEntries(
        application.formData instanceof Map
          ? application.formData
          : Object.entries(application.formData)
      )
    : {};

  const referenceNo = application?._id
    ? `PMSSS/${application._id.slice(-8).toUpperCase()}`
    : null;
  const filedOn = application?.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // docket steps — a genuine sequence, numbering earns its place here
  const docketSteps = [
    {
      no: "01",
      label: "Aadhaar Verified",
      caption: "Identity confirmed against submitted number",
      done: userData?.aadhaarVerified,
    },
    {
      no: "02",
      label: "Application Filed",
      caption: "Form saved to your case file",
      done: hasApplication,
    },
    {
      no: "03",
      label: "Submitted for Review",
      caption: "Locked and sent to SAG office",
      done: ["submitted", "verified", "disbursed"].includes(status),
    },
    {
      no: "04",
      label: "SAG Verification",
      caption:
        status === "rejected"
          ? "Returned — see rejection note below"
          : "Documents checked by the Students Advisory Group",
      done: ["verified", "disbursed"].includes(status),
      active: status === "submitted",
      rejected: status === "rejected",
    },
    {
      no: "05",
      label: "Disbursement",
      caption: "Scholarship amount released",
      done: status === "disbursed",
      active: status === "verified",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
        <Loader2 className="w-6 h-6 animate-spin text-[#16213E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">

        {/* ---- Case file header (letterhead) ---- */}
        <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm">
          <div className="flex flex-wrap items-start justify-between gap-6 px-6 sm:px-8 py-6 border-b border-[#DCD6C8]">
            <div>
              <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-2">
                PMSSS &middot; Scholarship Case File
              </p>
              <h1 className="font-serif-display text-2xl sm:text-3xl text-[#16213E] leading-tight">
                {userData?.fullName || "Student"}
              </h1>
              {hasApplication ? (
                <p className="font-mono-data text-xs text-[#6B6558] mt-2">
                  Ref. {referenceNo} {application?.academicYear && <>&middot; {application.academicYear} </>}{filedOn && <>&middot; Filed {filedOn}</>}
                </p>
              ) : (
                <p className="text-sm text-[#6B6558] mt-2">
                  No case file opened yet
                </p>
              )}
            </div>

            {hasApplication && (
              <StatusStamp status={status} />
            )}
          </div>
        </div>

        {/* ---- No application yet ---- */}
        {!hasApplication && (
          <div className="mt-6 border border-dashed border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-10 text-center">
            <FilePlus className="w-8 h-8 mx-auto mb-4 text-[#B8860B]" strokeWidth={1.5} />
            <h2 className="font-serif-display text-xl text-[#16213E] mb-2">
              Your case file is empty
            </h2>
            <p className="text-sm text-[#6B6558] mb-6 max-w-md mx-auto">
              Verify your Aadhaar and file your application to begin the
              PMSSS scholarship process.
            </p>
            <button
              onClick={() => navigate("/scholarship-application")}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#16213E] hover:bg-[#0F1729] text-white text-sm font-medium rounded-sm transition"
            >
              Open Application <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---- Main content ---- */}
        {hasApplication && (
          <div className="mt-6 grid lg:grid-cols-3 gap-6">

            {/* ---- Left: docket stepper + register ---- */}
            <div className="lg:col-span-2 space-y-6">

              {/* Docket stepper */}
              <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-6 sm:p-8">
                <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-6">
                  Case Progress
                </p>
                <div className="space-y-0">
                  {docketSteps.map((step, i) => (
                    <div key={step.no} className="relative flex gap-4 pb-6 last:pb-0">
                      {i !== docketSteps.length - 1 && (
                        <div
                          className="absolute left-[15px] top-8 bottom-0 w-px"
                          style={{
                            backgroundColor: step.done ? "#16213E" : "#DCD6C8",
                          }}
                        />
                      )}
                      <div
                        className="relative z-10 shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-serif-display text-xs"
                        style={{
                          borderColor: step.rejected
                            ? "#8B2E2E"
                            : step.done
                            ? "#16213E"
                            : step.active
                            ? "#B8860B"
                            : "#DCD6C8",
                          backgroundColor: step.done
                            ? "#16213E"
                            : "transparent",
                          color: step.done
                            ? "#FFFEFB"
                            : step.rejected
                            ? "#8B2E2E"
                            : step.active
                            ? "#B8860B"
                            : "#B7B0A0",
                        }}
                      >
                        {step.rejected ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : step.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          step.no
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: step.rejected
                              ? "#8B2E2E"
                              : step.done || step.active
                              ? "#16213E"
                              : "#B7B0A0",
                          }}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-[#8A8374] mt-0.5">
                          {step.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application register (ledger rows, not a card grid) */}
              <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-6 sm:p-8">
                <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-5">
                  Application Register
                </p>

                {Object.keys(formData).length > 0 ? (
                  <div>
                    {Object.entries(formData).map(([key, value]) =>
                      value ? (
                        <LedgerRow
                          key={key}
                          label={key.replace(/([A-Z])/g, " $1")}
                          value={value}
                        />
                      ) : null
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#8A8374] italic">
                    No form data saved yet.
                  </p>
                )}

                {/* Rejection note — margin-note style, not an alert box */}
                {status === "rejected" && application.rejectionReason && (
                  <div className="mt-5 pl-4 border-l-2" style={{ borderColor: "#8B2E2E" }}>
                    <p className="text-xs font-mono-data uppercase tracking-wide text-[#8B2E2E] mb-1">
                      Rejection Note
                    </p>
                    <p className="text-sm text-[#5C3A3A]">
                      {application.rejectionReason}
                    </p>
                  </div>
                )}

                {/* SAG verified note */}
                {status === "verified" && application.sagVerifiedBy && (
                  <div className="mt-5 pl-4 border-l-2" style={{ borderColor: "#2F6F4F" }}>
                    <p className="text-xs font-mono-data uppercase tracking-wide text-[#2F6F4F] mb-1">
                      Verified By
                    </p>
                    <p className="text-sm text-[#16213E]">
                      {application.sagVerifiedBy.fullName} &middot;{" "}
                      {application.sagVerifiedBy.email}
                      {application.sagVerifiedAt &&
                        ` &middot; ${new Date(
                          application.sagVerifiedAt
                        ).toLocaleDateString("en-IN")}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ---- Right: actions, receipt, identity ---- */}
            <div className="space-y-6">

              {/* Quick actions — plain list, no colored icon chips */}
              <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-5">
                <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-3">
                  Actions
                </p>
                <button
                  onClick={() => navigate("/scholarship-application")}
                  className="w-full flex items-center gap-3 text-sm py-2.5 border-b border-[#EDE9DE] hover:text-[#16213E] text-[#3A3A3A] transition group"
                >
                  <FileText className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span className="font-medium">View / Edit Application</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </button>
                <button
                  onClick={() => navigate("/view-docs")}
                  className="w-full flex items-center gap-3 text-sm py-2.5 hover:text-[#16213E] text-[#3A3A3A] transition group"
                >
                  <Eye className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span className="font-medium">View Documents</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </button>
              </div>

              {/* Payment — styled like a tear-off receipt / chalan */}
              <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className="w-4 h-4 text-[#16213E]" strokeWidth={1.5} />
                  <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374]">
                    Disbursement
                  </p>
                </div>

                {status === "disbursed" && payment ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between border-b border-dashed border-[#DCD6C8] pb-2">
                      <span className="text-xs text-[#8A8374]">Transaction ID</span>
                      <span className="font-mono-data text-sm text-[#16213E]">
                        {payment.transactionId}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#8A8374]">Disbursed On</span>
                      <span className="text-sm text-[#16213E] font-medium">
                        {new Date(payment.disbursedAt).toLocaleDateString(
                          "en-IN",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#8A8374]">
                    {status === "verified"
                      ? "Cleared for disbursement — awaiting finance processing."
                      : "Released once SAG verification is complete."}
                  </p>
                )}
              </div>

              {/* Identity card */}
              <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-[#16213E]" strokeWidth={1.5} />
                  <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374]">
                    Identity
                  </p>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#8A8374]">Email</span>
                    <span className="text-sm text-[#16213E] truncate max-w-[65%] text-right">
                      {userData?.email || "—"}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#8A8374]">Mobile</span>
                    <span className="text-sm text-[#16213E]">
                      {userData?.mobile || "—"}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#8A8374]">Aadhaar</span>
                    {userData?.aadhaarVerified ? (
                      <span
                        className="text-xs font-medium inline-flex items-center gap-1"
                        style={{ color: "#2F6F4F" }}
                      >
                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#B8860B]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
