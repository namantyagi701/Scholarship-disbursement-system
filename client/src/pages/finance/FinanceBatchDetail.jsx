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

const maskAccount = (num) => {
  if (!num || num.length <= 4) return num || "—";
  return "••••" + num.slice(-4);
};

const paymentStatusBadge = (status) => {
  const map = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Paid: "bg-green-100 text-green-700 border-green-200",
    Failed: "bg-red-100 text-red-700 border-red-200",
  };
  const dotMap = {
    Pending: "bg-yellow-500",
    Paid: "bg-green-500",
    Failed: "bg-red-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${map[status] || map.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status] || dotMap.Pending}`} />
      {status}
    </span>
  );
};

const batchStatusBadge = (status) => {
  const map = {
    Generated: "bg-blue-100 text-blue-700 border-blue-200",
    "Sent to Bank": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Processing: "bg-orange-100 text-orange-700 border-orange-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
  };
  const dotMap = {
    Generated: "bg-blue-500",
    "Sent to Bank": "bg-yellow-500",
    Processing: "bg-orange-500",
    Completed: "bg-green-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${map[status] || map.Generated}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status] || dotMap.Generated}`} />
      {status}
    </span>
  );
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Batch not found</p>
          <button
            onClick={() => navigate("/finance/batches")}
            className="mt-4 text-blue-600 hover:underline text-sm font-medium"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/finance/batches")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Batches
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-7 h-7 text-blue-600" />
              {batch.batchId}
            </h1>
            {batch.parentBatchId && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Retry of{" "}
                <button
                  onClick={() => navigate(`/finance/batch/${batch.parentBatchId}`)}
                  className="text-blue-600 hover:underline font-mono font-medium inline-flex items-center gap-0.5"
                >
                  {batch.parentBatchId}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {canForward && (
              <button
                onClick={() => setForwardModal(true)}
                disabled={forwardLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                Forward to Bank
              </button>
            )}
            {hasFailures && (
              <button
                onClick={() => setRetryModal(true)}
                disabled={retryLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Failed Payments
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Forward loading overlay */}
      {forwardLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-lg font-bold text-gray-900">Processing Bank Transfer</p>
            <p className="text-sm text-gray-500 text-center">
              Forwarding payment batch to bank…<br />This may take a few moments.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      )}

      {/* Batch Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Batch Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Generated By</p>
            <p className="text-sm font-medium text-gray-900">{batch.generatedBy?.fullName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Generated Date</p>
            <p className="text-sm font-medium text-gray-900">
              {batch.generatedAt ? new Date(batch.generatedAt).toLocaleString("en-IN") : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Students</p>
            <p className="text-sm font-bold text-gray-900">{batch.totalStudents}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Total Amount</p>
            <p className="text-sm font-bold text-gray-900">₹{(batch.totalAmount || 0).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-500">Status:</span>
          {batchStatusBadge(batch.status)}
        </div>
      </div>

      {/* Payment Summary Stats */}
      {batch.status === "Completed" && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl border border-green-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{paidCount}</p>
              <p className="text-xs text-green-600">Paid</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{failedCount}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
              <p className="text-xs text-yellow-600">Pending</p>
            </div>
          </div>
        </div>
      )}

      {/* Student Payment Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Students in this Batch</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Application ID</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Bank Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Account No.</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payment Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">UTR Number</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Failed Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batch.applications?.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{entry.studentName}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-500">
                    {entry.application?.toString().slice(-8)?.toUpperCase() || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-900 text-right font-medium">
                    ₹{(entry.amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{entry.bankName || "N/A"}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-mono">{maskAccount(entry.accountNumber)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{paymentStatusBadge(entry.paymentStatus)}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-600">{entry.transactionId || "—"}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-600">{entry.utrNumber || "—"}</td>
                  <td className="px-5 py-4 text-xs text-red-600">{entry.failedReason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forward to Bank Confirmation Modal */}
      {forwardModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Forward to Bank</h3>
                <p className="text-sm text-gray-500">Confirm bank transfer initiation</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Batch ID</span>
                <span className="font-mono font-semibold text-gray-900">{batch.batchId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Students</span>
                <span className="font-semibold text-gray-900">{batch.totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold text-gray-900">₹{(batch.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-800">
                  This will initiate a bank transfer for all applications in this batch. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setForwardModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleForwardToBank}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Retry Failed Payments</h3>
                <p className="text-sm text-gray-500">Create a new batch for failed applications</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Source Batch</span>
                <span className="font-mono font-semibold text-gray-900">{batch.batchId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Failed Payments</span>
                <span className="font-semibold text-red-600">{failedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Retry Amount</span>
                <span className="font-semibold text-gray-900">
                  ₹{(batch.applications?.filter((a) => a.paymentStatus === "Failed").reduce((s, a) => s + (a.amount || 0), 0) || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                A new payment batch will be created containing only the {failedCount} failed application{failedCount > 1 ? "s" : ""}. 
                Successfully paid applications will remain unchanged. You can then forward the new batch to the bank.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRetryModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRetryFailed}
                disabled={retryLoading}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {retryLoading ? "Creating..." : "Create Retry Batch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceBatchDetail;
