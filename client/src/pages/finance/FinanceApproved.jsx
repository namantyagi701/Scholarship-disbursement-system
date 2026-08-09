import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Loader2,
  Search,
  IndianRupee,
  Package,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Download,
  Landmark,
  CreditCard
} from "lucide-react";
import StatusStamp from "../../components/ui/StatusStamp";

const ROWS_PER_PAGE = 10;

const maskAccount = (num) => {
  if (!num || num.length <= 4) return num || "—";
  return "••••" + num.slice(-4);
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
  const verifiedOnPage = paginated.filter((a) => a.status === "verified" && !a.batchId);
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
        if (data.skippedCount > 0) {
          toast.warn(`${data.skippedCount} application(s) were already in another batch and were skipped.`);
        }
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
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAF8F3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16213E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#16213E] font-sans pb-12">
      {/* Header */}
      <div className="bg-[#FFFEFB] border-b border-[#DCD6C8] px-8 py-10 mb-8 flex flex-col items-center justify-center text-center shadow-sm">
        <p className="font-mono-data text-xs text-[#B8860B] tracking-widest uppercase mb-3">PMSSS · Finance</p>
        <h1 className="font-serif-display text-4xl text-[#16213E]">Approved Applications</h1>
        <p className="font-mono-data text-sm text-[#16213E]/60 mt-3">Disburse payments for SAG-verified applications</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ledger Summary Strip */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#DCD6C8] mb-8 shadow-sm">
          <div className="flex-1 p-5 text-center">
            <p className="font-serif-display text-3xl text-[#16213E] mb-1">{counts.all}</p>
            <p className="font-mono-data text-xs text-[#16213E]/60 uppercase tracking-widest">Total</p>
          </div>
          <div className="flex-1 p-5 text-center">
            <p className="font-serif-display text-3xl text-[#16213E] mb-1">{counts.verified}</p>
            <p className="font-mono-data text-xs text-[#16213E]/60 uppercase tracking-widest">Pending Disbursement</p>
          </div>
          <div className="flex-1 p-5 text-center">
            <p className="font-serif-display text-3xl text-[#16213E] mb-1">{counts.disbursed}</p>
            <p className="font-mono-data text-xs text-[#16213E]/60 uppercase tracking-widest">Disbursed</p>
          </div>
        </div>

        {/* Filters & Batch Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end sm:items-center">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#DCD6C8] flex-1 w-full sm:w-auto">
            {["all", "verified", "disbursed"].map((f) => {
              const label = f === "all" ? "All" : f === "verified" ? "Pending" : "Disbursed";
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`pb-2 text-sm font-mono-data uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border-b-2 border-[#16213E] text-[#16213E] font-semibold"
                      : "text-[#16213E]/50 hover:text-[#16213E]"
                  }`}
                >
                  {label} ({counts[f] ?? 0})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#16213E]/40" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border-0 border-b border-[#DCD6C8] bg-transparent text-sm focus:outline-none focus:border-[#16213E] focus:ring-0 font-mono-data placeholder-[#16213E]/40"
            />
          </div>
        </div>

        {/* Batch Action Bar */}
        {(selected.size > 0 || generatedBatch) && (
          <div className="bg-[#FAF8F3] border border-[#16213E] rounded-sm p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-[#16213E] font-mono-data">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors disabled:opacity-50"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors"
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

        {/* Forward Result Toast */}
        {forwardResult && (
          <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-mono-data font-semibold text-[#16213E] uppercase tracking-wider">Bank Processing Result</h3>
              <button onClick={() => setForwardResult(null)} className="text-[#16213E]/40 hover:text-[#16213E]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-6 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#2F6F4F]" />
                <span className="text-sm font-mono-data text-[#16213E]">{forwardResult.paidCount} Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#8B2E2E]" />
                <span className="text-sm font-mono-data text-[#16213E]">{forwardResult.failedCount} Failed</span>
              </div>
            </div>
            {forwardResult.failedCount > 0 && (
              <p className="text-xs font-mono-data text-[#16213E]/60 mt-2">
                Failed payments can be retried from the{" "}
                <button
                  onClick={() => navigate(`/finance/batch/${forwardResult.batch?.batchId}`)}
                  className="text-[#B8860B] hover:underline font-medium"
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
          <div className="text-center py-16 bg-[#FFFEFB] rounded-sm border border-[#DCD6C8]">
            <CreditCard className="w-10 h-10 text-[#16213E]/20 mx-auto mb-3" />
            <p className="text-[#16213E]/60 font-mono-data text-sm uppercase tracking-widest">No applications found</p>
          </div>
        ) : (
          <div className="bg-[#FFFEFB] rounded-sm border border-[#DCD6C8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#DCD6C8]">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allVerifiedOnPageSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-[#DCD6C8] text-[#16213E] focus:ring-[#16213E]"
                      />
                    </th>
                    <th className="px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Application ID</th>
                    <th className="px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Student Name</th>
                    <th className="text-right px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Bank Name</th>
                    <th className="px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Account No.</th>
                    <th className="px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">IFSC</th>
                    <th className="px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD6C8]">
                  {paginated.map((app) => {
                    const isSelectable = app.status === "verified" && !app.batchId;
                    return (
                      <tr key={app._id} className="hover:bg-[#FAF8F3] transition-colors">
                        <td className="px-4 py-4">
                          {isSelectable ? (
                            <input
                              type="checkbox"
                              checked={selected.has(app._id)}
                              onChange={() => toggleSelect(app._id)}
                              className="w-4 h-4 rounded border-[#DCD6C8] text-[#16213E] focus:ring-[#16213E]"
                            />
                          ) : (
                            <span className="block w-4" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs font-mono-data text-[#16213E]/70">{app._id?.slice(-8)?.toUpperCase()}</td>
                        <td className="px-4 py-4 text-sm font-medium text-[#16213E]">{app.student?.fullName || "—"}</td>
                        <td className="px-4 py-4 text-sm text-[#16213E] text-right font-mono-data font-medium">
                          {app.amount ? `₹${app.amount.toLocaleString("en-IN")}` : "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#16213E]/70">
                          {app.formData?.bankName || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#16213E]/70">
                          <div className="flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-[#16213E]/40" />
                            <span className="font-mono-data">{maskAccount(app.bankAccountNumber)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#16213E]/70 font-mono-data">{app.ifscCode || "—"}</td>
                        <td className="px-4 py-4">
                          <div className="scale-75 origin-left">
                            <StatusStamp status={app.financeStatus || (app.status === "disbursed" ? "Paid" : "Pending")} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {app.status === "verified" && !app.batchId ? (
                            <button
                              onClick={() => setDisburseModal(app)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#16213E] text-[#16213E] hover:bg-[#16213E] hover:text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors"
                            >
                              <IndianRupee className="w-3.5 h-3.5" /> Disburse
                            </button>
                          ) : (
                            <span className="text-xs font-mono-data text-[#16213E]/40 uppercase tracking-wider">Completed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#DCD6C8] bg-[#FAF8F3]">
              <p className="text-xs font-mono-data text-[#16213E]/60">
                Showing {(safePage - 1) * ROWS_PER_PAGE + 1}–{Math.min(safePage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded-sm text-[#16213E]/60 hover:bg-[#DCD6C8]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-sm text-xs font-mono-data transition-colors ${
                      p === safePage
                        ? "bg-[#16213E] text-[#FFFEFB]"
                        : "text-[#16213E]/60 hover:bg-[#DCD6C8]/50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded-sm text-[#16213E]/60 hover:bg-[#DCD6C8]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single Disburse Modal */}
      {disburseModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm w-full max-w-md p-6">
            <h3 className="text-xl font-serif-display text-[#16213E] mb-2">Disburse Payment</h3>
            <p className="text-xs font-mono-data text-[#16213E]/60 mb-4 uppercase tracking-wider">
              Disbursing to <span className="font-semibold text-[#16213E]">{disburseModal.student?.fullName}</span>
            </p>

            {/* Bank Details Confirmation */}
            <div className="bg-[#FAF8F3] border border-[#DCD6C8] rounded-sm p-4 mb-4 space-y-2">
              <p className="text-xs font-mono-data text-[#16213E]/50 uppercase tracking-widest mb-3">Payment Destination</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#16213E]/70 font-mono-data">Amount</span>
                <span className="font-semibold font-mono-data text-[#16213E]">
                  {disburseModal.amount ? `₹${disburseModal.amount.toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#16213E]/70 font-mono-data">Account</span>
                <span className="font-mono-data text-[#16213E]">{disburseModal.bankAccountNumber || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#16213E]/70 font-mono-data">IFSC</span>
                <span className="font-mono-data text-[#16213E]">{disburseModal.ifscCode || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#16213E]/70 font-mono-data">Holder</span>
                <span className="text-[#16213E] uppercase tracking-wide text-xs mt-0.5">{disburseModal.accountHolderName || "—"}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-data text-[#16213E]/70 uppercase tracking-wider mb-2">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID..."
                className="w-full border-0 border-b border-[#DCD6C8] bg-transparent p-2 text-sm focus:outline-none focus:border-[#16213E] focus:ring-0 font-mono-data"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setDisburseModal(null); setTransactionId(""); }}
                className="px-4 py-2 text-xs font-mono-data text-[#16213E]/60 hover:text-[#16213E] uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisburse}
                disabled={actionLoading}
                className="px-5 py-2 bg-[#16213E] hover:bg-[#0F1729] text-[#FFFEFB] rounded-sm text-xs font-mono-data uppercase tracking-wider transition-colors disabled:opacity-50"
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
                <span className="font-mono-data font-semibold text-[#16213E]">{generatedBatch?.batchId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#16213E]/70 font-mono-data">Students</span>
                <span className="font-semibold font-mono-data text-[#16213E]">{generatedBatch?.totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#16213E]/70 font-mono-data">Total Amount</span>
                <span className="font-semibold font-mono-data text-[#16213E]">
                  ₹{generatedBatch?.totalAmount?.toLocaleString("en-IN")}
                </span>
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
    </div>
  );
};

export default FinanceApproved;
