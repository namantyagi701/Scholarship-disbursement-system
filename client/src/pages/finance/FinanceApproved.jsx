import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Search,
  User,
  IndianRupee,
  Clock,
  Landmark,
  Package,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Download,
} from "lucide-react";

const ROWS_PER_PAGE = 10;

const maskAccount = (num) => {
  if (!num || num.length <= 4) return num || "—";
  return "••••" + num.slice(-4);
};

const statusBadge = (status) => {
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
  const label = status || "Pending";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${map[label] || map.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[label] || dotMap.Pending}`} />
      {label}
    </span>
  );
};

const FinanceApproved = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Multi-select
  const [selected, setSelected] = useState(new Set());

  // Single disburse modal (existing)
  const [disburseModal, setDisburseModal] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Batch flow
  const [generatedBatch, setGeneratedBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [forwardModal, setForwardModal] = useState(false);
  const [forwardLoading, setForwardLoading] = useState(false);
  const [forwardResult, setForwardResult] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/finance/approved-applications");
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Filtering & Pagination ─────────────────────────────────────────
  const filtered = applications.filter((app) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && app.status === "verified") ||
      (filter === "disbursed" && app.status === "disbursed");
    const matchesSearch =
      !search ||
      app.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      app._id?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const counts = {
    all: applications.length,
    verified: applications.filter((a) => a.status === "verified").length,
    disbursed: applications.filter((a) => a.status === "disbursed").length,
  };

  // ─── Selection helpers ──────────────────────────────────────────────
  const verifiedOnPage = paginated.filter((a) => a.status === "verified" && a.financeStatus !== "Paid");
  const allVerifiedOnPageSelected = verifiedOnPage.length > 0 && verifiedOnPage.every((a) => selected.has(a._id));

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allVerifiedOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        verifiedOnPage.forEach((a) => next.delete(a._id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        verifiedOnPage.forEach((a) => next.add(a._id));
        return next;
      });
    }
  };

  // ─── Single Disburse (existing) ─────────────────────────────────────
  const handleDisburse = async () => {
    if (!transactionId.trim()) {
      toast.error("Transaction ID is required");
      return;
    }
    setActionLoading(true);
    try {
      const { data } = await axios.put(backendUrl + `/api/finance/disburse/${disburseModal._id}`, {
        transactionId,
      });
      if (data.success) {
        toast.success(data.message);
        setDisburseModal(null);
        setTransactionId("");
        fetchApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Disbursement failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Batch Generation ───────────────────────────────────────────────
  const handleGenerateBatch = async () => {
    if (selected.size === 0) {
      toast.error("Select at least one application");
      return;
    }
    setBatchLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/finance/generate-batch", {
        applicationIds: Array.from(selected),
      });
      if (data.success) {
        setGeneratedBatch(data.batch);
        toast.success(`Batch ${data.batch.batchId} generated`);

        // Trigger CSV download
        const blob = new Blob([data.csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSelected(new Set());
        fetchApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Batch generation failed");
    } finally {
      setBatchLoading(false);
    }
  };

  // ─── Forward to Bank ────────────────────────────────────────────────
  const handleForwardToBank = async () => {
    if (!generatedBatch) return;
    setForwardLoading(true);
    setForwardModal(false);

    // Simulate 2–3 second processing delay on the frontend
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));

    try {
      const { data } = await axios.put(
        backendUrl + `/api/finance/forward-to-bank/${generatedBatch.batchId}`
      );
      if (data.success) {
        setForwardResult(data);
        toast.success(data.message);
        setGeneratedBatch(null);
        fetchApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Bank forwarding failed");
    } finally {
      setForwardLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Finance — Approved Applications</h1>
        <p className="text-gray-500 mt-1">Disburse payments for SAG-verified applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.verified}</p>
            <p className="text-xs text-gray-500">Pending Disbursement</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.disbursed}</p>
            <p className="text-xs text-gray-500">Disbursed</p>
          </div>
        </div>
      </div>

      {/* Filters & Batch Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or application ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "verified", "disbursed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "All" : f === "verified" ? "Pending" : "Disbursed"} ({counts[f] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* Batch Action Bar */}
      {(selected.size > 0 || generatedBatch) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Package className="w-4 h-4" />
            {generatedBatch ? (
              <span>
                Batch <span className="font-bold">{generatedBatch.batchId}</span> generated
                — {generatedBatch.totalStudents} students, ₹{generatedBatch.totalAmount?.toLocaleString("en-IN")}
              </span>
            ) : (
              <span>
                <span className="font-bold">{selected.size}</span> application{selected.size > 1 ? "s" : ""} selected
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {!generatedBatch && (
              <button
                onClick={handleGenerateBatch}
                disabled={batchLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {batchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Generate Payment Batch
              </button>
            )}
            {generatedBatch && generatedBatch.status === "Generated" && (
              <button
                onClick={() => setForwardModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Forward to Bank
              </button>
            )}
          </div>
        </div>
      )}

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

      {/* Forward Result Toast */}
      {forwardResult && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Bank Processing Result</h3>
            <button onClick={() => setForwardResult(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">{forwardResult.paidCount} Paid</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-700">{forwardResult.failedCount} Failed</span>
            </div>
          </div>
          {forwardResult.failedCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Failed payments can be retried from the{" "}
              <button
                onClick={() => navigate(`/finance/batch/${forwardResult.batch?.batchId}`)}
                className="text-blue-600 hover:underline font-medium"
              >
                Batch Details
              </button>{" "}
              page.
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allVerifiedOnPageSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Application ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bank Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Account No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">IFSC</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Finance Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((app) => {
                  const isSelectable = app.status === "verified" && app.financeStatus !== "Paid";
                  return (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        {isSelectable ? (
                          <input
                            type="checkbox"
                            checked={selected.has(app._id)}
                            onChange={() => toggleSelect(app._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="block w-4" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-gray-500">{app._id?.slice(-8)?.toUpperCase()}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{app.student?.fullName || "—"}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                        {app.amount ? `₹${app.amount.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {app.formData?.bankName || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono">{maskAccount(app.bankAccountNumber)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 font-mono">{app.ifscCode || "—"}</td>
                      <td className="px-4 py-4">
                        {statusBadge(app.financeStatus || (app.status === "disbursed" ? "Paid" : "Pending"))}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {app.status === "verified" && app.financeStatus !== "Paid" ? (
                          <button
                            onClick={() => setDisburseModal(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            <IndianRupee className="w-4 h-4" /> Disburse
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {(safePage - 1) * ROWS_PER_PAGE + 1}–{Math.min(safePage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    p === safePage
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Disburse Modal */}
      {disburseModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Disburse Payment</h3>
            <p className="text-sm text-gray-500 mb-4">
              Disbursing to <span className="font-semibold text-gray-700">{disburseModal.student?.fullName}</span>
            </p>

            {/* Bank Details Confirmation */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Destination</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold text-gray-900">
                  {disburseModal.amount ? `₹${disburseModal.amount.toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Account</span>
                <span className="font-mono text-gray-900">{disburseModal.bankAccountNumber || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IFSC</span>
                <span className="font-mono text-gray-900">{disburseModal.ifscCode || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Holder</span>
                <span className="text-gray-900">{disburseModal.accountHolderName || "—"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => { setDisburseModal(null); setTransactionId(""); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDisburse}
                disabled={actionLoading}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "Confirm Disbursement"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                <span className="font-mono font-semibold text-gray-900">{generatedBatch?.batchId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Students</span>
                <span className="font-semibold text-gray-900">{generatedBatch?.totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold text-gray-900">
                  ₹{generatedBatch?.totalAmount?.toLocaleString("en-IN")}
                </span>
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
    </div>
  );
};

export default FinanceApproved;
