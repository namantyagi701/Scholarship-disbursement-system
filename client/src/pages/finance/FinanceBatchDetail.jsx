import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Loader2,
  Package,
  Calendar,
  User,
  IndianRupee,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  RotateCcw,
  Landmark,
  X,
  ExternalLink,
} from "lucide-react";
import StatusStamp from "../../components/ui/StatusStamp";

const maskAccount = (num) => {
  if (!num || num.length <= 4) return num || "—";
  return "••••" + num.slice(-4);
};

const FinanceBatchDetail = () => {
  const { backendUrl } = useContext(AppContent);
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Forward to Bank
  const [forwardModal, setForwardModal] = useState(false);
  const [forwardLoading, setForwardLoading] = useState(false);

  // Retry
  const [retryModal, setRetryModal] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  const fetchBatch = async () => {
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + `/api/finance/batch/${batchId}`);
      if (data.success) {
        setBatch(data.batch);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load batch details");
    } finally {
      setLoading(false);
    }
  };

  // Forward to Bank
  const handleForwardToBank = async () => {
    setForwardModal(false);
    setForwardLoading(true);

    // Simulate 2–3 second delay
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));

    try {
      const { data } = await axios.put(backendUrl + `/api/finance/forward-to-bank/${batchId}`);
      if (data.success) {
        toast.success(data.message);
        fetchBatch();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Bank forwarding failed");
    } finally {
      setForwardLoading(false);
    }
  };

  // Retry Failed
  const handleRetryFailed = async () => {
    setRetryModal(false);
    setRetryLoading(true);
    try {
      const { data } = await axios.post(backendUrl + `/api/finance/batch/${batchId}/retry-failed`);
      if (data.success) {
        toast.success(data.message);
        navigate(`/finance/batch/${data.batch.batchId}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Retry failed");
    } finally {
      setRetryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAF8F3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16213E]" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] px-4 py-12 text-center">
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm max-w-md mx-auto p-8">
          <Package className="w-10 h-10 text-[#16213E]/20 mx-auto mb-3" />
          <p className="text-[#16213E] font-mono-data text-sm uppercase tracking-widest mb-6">Batch not found</p>
          <button
            onClick={() => navigate("/finance/batches")}
            className="text-[#B8860B] hover:underline text-xs font-mono-data uppercase tracking-wider transition-colors"
          >
            ← Back to Batches
          </button>
        </div>
      </div>
    );
  }

  const paidCount = batch.applications?.filter((a) => a.paymentStatus === "Paid").length || 0;
  const failedCount = batch.applications?.filter((a) => a.paymentStatus === "Failed").length || 0;
  const pendingCount = batch.applications?.filter((a) => a.paymentStatus === "Pending").length || 0;
  const hasFailures = failedCount > 0 && batch.status === "Completed";
  const canForward = batch.status === "Generated";

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#16213E] font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/finance/batches")}
          className="flex items-center gap-2 text-[#16213E]/60 hover:text-[#16213E] mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Batches
        </button>

        {/* Page Header block with batch actions */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] px-8 py-10 mb-8 rounded-sm text-center relative flex flex-col items-center">
          
          <div className="absolute top-6 right-6 hidden sm:block scale-90 origin-top-right">
             <StatusStamp status={batch.status} />
          </div>

          <p className="font-mono-data text-xs text-[#B8860B] tracking-widest uppercase mb-3">Payment Batch</p>
          <h1 className="font-serif-display text-4xl text-[#16213E]">{batch.batchId}</h1>
          {batch.parentBatchId && (
            <p className="font-mono-data text-sm text-[#16213E]/60 mt-3 inline-flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Retry of{" "}
              <button
                onClick={() => navigate(`/finance/batch/${batch.parentBatchId}`)}
                className="text-[#B8860B] hover:underline font-mono-data font-medium inline-flex items-center gap-0.5"
              >
                {batch.parentBatchId}
                <ExternalLink className="w-3 h-3" />
              </button>
            </p>
          )}

          <div className="mt-6 sm:hidden scale-90 origin-center mb-2">
            <StatusStamp status={batch.status} />
          </div>

          <div className="flex gap-3 mt-6">
            {canForward && (
              <button
                onClick={() => setForwardModal(true)}
                disabled={forwardLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Forward to Bank
              </button>
            )}
            {hasFailures && (
              <button
                onClick={() => setRetryModal(true)}
                disabled={retryLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Failed Payments
              </button>
            )}
          </div>
        </div>

        {/* Forward loading overlay */}
        {forwardLoading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#16213E]" />
              <p className="text-lg font-serif-display text-[#16213E]">Processing Bank Transfer</p>
              <p className="text-xs font-mono-data text-[#16213E]/60 text-center uppercase tracking-wider">
                Forwarding payment batch to bank…<br />This may take a few moments.
              </p>
              <div className="w-full bg-[#DCD6C8] rounded-sm h-1 mt-2">
                <div className="bg-[#16213E] h-1 rounded-sm animate-pulse" style={{ width: "70%" }} />
              </div>
            </div>
          </div>
        )}

        {/* Batch Info Card */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] p-6 mb-6 rounded-sm">
          <h2 className="text-xl font-serif-display text-[#16213E] mb-4">Batch Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Generated By
              </p>
              <p className="text-sm font-medium text-[#16213E]">{batch.generatedBy?.fullName || "—"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Generated Date
              </p>
              <p className="text-sm font-medium font-mono-data text-[#16213E]">
                {batch.generatedAt ? new Date(batch.generatedAt).toLocaleString("en-IN") : "—"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Total Students</p>
              <p className="text-sm font-bold font-mono-data text-[#16213E]">{batch.totalStudents}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" /> Total Amount
              </p>
              <p className="text-sm font-bold font-mono-data text-[#16213E]">₹{(batch.totalAmount || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Payment Summary Stats */}
        {batch.status === "Completed" && (
          <div className="grid grid-cols-3 gap-0 border border-[#DCD6C8] divide-x divide-[#DCD6C8] mb-6 rounded-sm">
            <div className="bg-[#FFFEFB] p-5 flex flex-col items-center justify-center gap-1">
              <p className="text-2xl font-mono-data font-bold text-[#2F6F4F]">{paidCount}</p>
              <p className="text-xs font-mono-data uppercase tracking-wider text-[#16213E]/60">Paid</p>
            </div>
            <div className="bg-[#FFFEFB] p-5 flex flex-col items-center justify-center gap-1">
              <p className="text-2xl font-mono-data font-bold text-[#8B2E2E]">{failedCount}</p>
              <p className="text-xs font-mono-data uppercase tracking-wider text-[#16213E]/60">Failed</p>
            </div>
            <div className="bg-[#FFFEFB] p-5 flex flex-col items-center justify-center gap-1">
              <p className="text-2xl font-mono-data font-bold text-[#B8860B]">{pendingCount}</p>
              <p className="text-xs font-mono-data uppercase tracking-wider text-[#16213E]/60">Pending</p>
            </div>
          </div>
        )}

        {/* Student Payment Table */}
        <div className="bg-[#FFFEFB] rounded-sm border border-[#DCD6C8] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#DCD6C8] bg-[#FAF8F3]">
            <h2 className="text-sm font-mono-data font-semibold text-[#16213E] uppercase tracking-wider">Students in this Batch</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#DCD6C8]">
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Student Name</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Application ID</th>
                  <th className="text-right px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Bank Name</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Account No.</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Payment Status</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">UTR Number</th>
                  <th className="px-5 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Failed Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD6C8]">
                {batch.applications?.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#16213E]">{entry.studentName}</td>
                    <td className="px-5 py-4 text-xs font-mono-data text-[#16213E]/70">
                      {entry.application?.toString().slice(-8)?.toUpperCase() || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#16213E] text-right font-mono-data font-medium">
                      ₹{(entry.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#16213E]/70">{entry.bankName || "N/A"}</td>
                    <td className="px-5 py-4 text-sm text-[#16213E]/70">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-[#16213E]/40" />
                        <span className="font-mono-data">{maskAccount(entry.accountNumber)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="scale-75 origin-left -ml-2">
                        <StatusStamp status={entry.paymentStatus} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono-data text-[#16213E]/70">{entry.transactionId || "—"}</td>
                    <td className="px-5 py-4 text-xs font-mono-data text-[#16213E]/70">{entry.utrNumber || "—"}</td>
                    <td className="px-5 py-4 text-xs font-mono-data text-[#8B2E2E]">{entry.failedReason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forward to Bank Confirmation Modal */}
        {forwardModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-[#DCD6C8] flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#16213E]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-display text-[#16213E]">Forward to Bank</h3>
                  <p className="text-xs font-mono-data text-[#16213E]/60 uppercase tracking-wider">Confirm bank transfer</p>
                </div>
              </div>

              <div className="bg-[#FAF8F3] border border-[#DCD6C8] rounded-sm p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#16213E]/70 font-mono-data">Batch ID</span>
                  <span className="font-mono-data font-semibold text-[#16213E]">{batch.batchId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#16213E]/70 font-mono-data">Students</span>
                  <span className="font-semibold font-mono-data text-[#16213E]">{batch.totalStudents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#16213E]/70 font-mono-data">Total Amount</span>
                  <span className="font-semibold font-mono-data text-[#16213E]">₹{(batch.totalAmount || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="border border-[#B8860B] bg-[#FAF8F3] rounded-sm p-3 mb-6">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
                  <p className="text-xs font-mono-data text-[#16213E]/70">
                    This will initiate a bank transfer for all applications in this batch. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setForwardModal(false)}
                  className="px-4 py-2 text-xs font-mono-data text-[#16213E]/60 hover:text-[#16213E] uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForwardToBank}
                  className="px-5 py-2 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors"
                >
                  Confirm & Forward
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Retry Failed Confirmation Modal */}
        {retryModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-[#DCD6C8] flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-display text-[#16213E]">Retry Failed Payments</h3>
                  <p className="text-xs font-mono-data text-[#16213E]/60 uppercase tracking-wider">Create a new batch for failed applications</p>
                </div>
              </div>

              <div className="bg-[#FAF8F3] border border-[#DCD6C8] rounded-sm p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#16213E]/70 font-mono-data">Source Batch</span>
                  <span className="font-mono-data font-semibold text-[#16213E]">{batch.batchId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#16213E]/70 font-mono-data">Failed Payments</span>
                  <span className="font-semibold font-mono-data text-[#8B2E2E]">{failedCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#16213E]/70 font-mono-data">Retry Amount</span>
                  <span className="font-semibold font-mono-data text-[#16213E]">
                    ₹{(batch.applications?.filter((a) => a.paymentStatus === "Failed").reduce((s, a) => s + (a.amount || 0), 0) || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border border-[#16213E]/30 bg-[#FAF8F3] rounded-sm p-3 mb-6">
                <p className="text-xs font-mono-data text-[#16213E]/70 leading-relaxed">
                  A new payment batch will be created containing only the <span className="font-bold">{failedCount}</span> failed application{failedCount > 1 ? "s" : ""}. 
                  Successfully paid applications will remain unchanged. You can then forward the new batch to the bank.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRetryModal(false)}
                  className="px-4 py-2 text-xs font-mono-data text-[#16213E]/60 hover:text-[#16213E] uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRetryFailed}
                  disabled={retryLoading}
                  className="px-5 py-2 bg-[#B8860B] hover:bg-[#A0750A] text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {retryLoading ? "Creating..." : "Create Retry Batch"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceBatchDetail;
