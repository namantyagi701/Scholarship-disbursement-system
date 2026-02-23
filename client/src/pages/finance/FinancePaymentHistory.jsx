import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import {
  CreditCard,
  Loader2,
  Search,
  Calendar,
  IndianRupee,
} from "lucide-react";

const FinancePaymentHistory = () => {
  const { backendUrl } = useContext(AppContent);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/finance/payment-history");
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch payment history", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter(
    (app) =>
      !search ||
      app.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">All disbursed scholarship payments</p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm flex items-center gap-6">
        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
          <IndianRupee className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
          <p className="text-sm text-gray-500">Total Disbursements</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No payment records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Disbursed By</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {app.student?.fullName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{app.student?.email || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {app.transactionId || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.disbursedBy?.fullName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {app.disbursedAt ? new Date(app.disbursedAt).toLocaleDateString() : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePaymentHistory;
