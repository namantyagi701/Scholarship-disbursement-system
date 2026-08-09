import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { Loader2, Search, Calendar, Landmark, CreditCard } from "lucide-react";

const maskAccount = (num) => {
  if (!num || num.length <= 4) return num || "—";
  return "••••" + num.slice(-4);
};

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
        <h1 className="font-serif-display text-4xl text-[#16213E]">Payment History</h1>
        <p className="font-mono-data text-sm text-[#16213E]/60 mt-3">All disbursed scholarship payments</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="bg-[#FFFEFB] border border-[#DCD6C8] rounded-sm flex mb-8">
          <div className="flex-1 p-5 text-center">
            <p className="font-serif-display text-3xl text-[#16213E] mb-1">{applications.length}</p>
            <p className="font-mono-data text-xs text-[#16213E]/60 uppercase tracking-widest">Total Disbursements</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#16213E]/40" />
          <input
            type="text"
            placeholder="Search by name, email, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border-0 border-b border-[#DCD6C8] bg-transparent text-sm focus:outline-none focus:border-[#16213E] focus:ring-0 font-mono-data placeholder-[#16213E]/40"
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFEFB] rounded-sm border border-[#DCD6C8]">
            <CreditCard className="w-10 h-10 text-[#16213E]/20 mx-auto mb-3" />
            <p className="text-[#16213E]/60 font-mono-data text-sm uppercase tracking-widest">No payment records found</p>
          </div>
        ) : (
          <div className="bg-[#FFFEFB] rounded-sm border border-[#DCD6C8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#DCD6C8]">
                    <th className="px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Email</th>
                    <th className="text-right px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Bank Details</th>
                    <th className="px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Disbursed By</th>
                    <th className="px-6 py-4 text-xs font-mono-data text-[#16213E]/50 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD6C8]">
                  {filtered.map((app) => (
                    <tr key={app._id} className="hover:bg-[#FAF8F3] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#16213E]">
                        {app.student?.fullName || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#16213E]/70">{app.student?.email || "—"}</td>
                      <td className="px-6 py-4 text-sm text-[#16213E] text-right font-mono-data font-medium">
                        {app.amount ? `₹${app.amount.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#16213E]/70">
                        <div className="flex items-center gap-2">
                          <Landmark className="w-3.5 h-3.5 text-[#16213E]/40" />
                          <span className="font-mono-data">{maskAccount(app.bankAccountNumber)}</span>
                          {app.ifscCode && <span className="text-[#16213E]/40 text-xs font-mono-data">({app.ifscCode})</span>}
                        </div>
                        {app.accountHolderName && (
                          <p className="text-xs text-[#16213E]/50 mt-1 uppercase tracking-wide">{app.accountHolderName}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#16213E] font-mono-data">
                        {app.transactionId || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#16213E]/70">
                        {app.disbursedBy?.fullName || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#16213E]/70">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#16213E]/40" />
                          <span className="font-mono-data">
                            {app.disbursedAt ? new Date(app.disbursedAt).toLocaleDateString() : "—"}
                          </span>
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
    </div>
  );
};

export default FinancePaymentHistory;
