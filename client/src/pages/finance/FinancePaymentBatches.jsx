import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Package,
  Loader2,
  Search,
  Eye,
  Download,
  FileText,
  Calendar,
  IndianRupee,
  Users,
  ArrowRight,
  X,
} from "lucide-react";

const statusBadge = (status) => {
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

const FinancePaymentBatches = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reportModal, setReportModal] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/finance/batches");
      if (data.success) {
        setBatches(data.batches);
      }
    } catch (error) {
      console.error("Failed to fetch batches", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async (batchId) => {
    try {
      const response = await axios.get(backendUrl + `/api/finance/batch/${batchId}/csv`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `payment_batch_${batchId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch (error) {
      toast.error("Failed to download CSV");
    }
  };

  const filtered = batches.filter(
    (b) =>
      !search ||
      b.batchId?.toLowerCase().includes(search.toLowerCase()) ||
      b.parentBatchId?.toLowerCase().includes(search.toLowerCase()) ||
      b.generatedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = batches.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalStudents = batches.reduce((sum, b) => sum + (b.totalStudents || 0), 0);

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
        <h1 className="text-3xl font-bold text-gray-900">Payment Batches</h1>
        <p className="text-gray-500 mt-1">View and manage all payment batch history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
            <p className="text-xs text-gray-500">Total Batches</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            <p className="text-xs text-gray-500">Total Students Processed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-500">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by batch ID or generated by..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No payment batches found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Batch ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Parent Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Generated Date</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Students</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((batch) => (
                  <tr key={batch._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">{batch.batchId}</td>
                    <td className="px-6 py-4 text-sm">
                      {batch.parentBatchId ? (
                        <button
                          onClick={() => navigate(`/finance/batch/${batch.parentBatchId}`)}
                          className="text-blue-600 hover:underline font-mono text-xs"
                        >
                          {batch.parentBatchId}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {batch.generatedAt ? new Date(batch.generatedAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }) : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">{batch.totalStudents}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      ₹{(batch.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">{statusBadge(batch.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/finance/batch/${batch.batchId}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadCsv(batch.batchId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium transition-colors"
                          title="Download CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                          CSV
                        </button>
                        {batch.status === "Completed" && (
                          <button
                            onClick={() => setReportModal(batch)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
                            title="Payment Report"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Payment Report</h3>
              <button onClick={() => setReportModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Batch ID</span>
                <span className="font-mono font-semibold text-gray-900">{reportModal.batchId}</span>
              </div>
              {reportModal.parentBatchId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Retry of</span>
                  <span className="font-mono text-blue-600">{reportModal.parentBatchId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Generated By</span>
                <span className="text-gray-900">{reportModal.generatedBy?.fullName || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">
                  {reportModal.generatedAt ? new Date(reportModal.generatedAt).toLocaleString("en-IN") : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Students</span>
                <span className="font-semibold text-gray-900">{reportModal.totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold text-gray-900">₹{(reportModal.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-green-700">
                  {reportModal.applications?.filter((a) => a.paymentStatus === "Paid").length || 0}
                </p>
                <p className="text-xs text-green-600">Paid</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-red-700">
                  {reportModal.applications?.filter((a) => a.paymentStatus === "Failed").length || 0}
                </p>
                <p className="text-xs text-red-600">Failed</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-yellow-700">
                  {reportModal.applications?.filter((a) => a.paymentStatus === "Pending").length || 0}
                </p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePaymentBatches;
