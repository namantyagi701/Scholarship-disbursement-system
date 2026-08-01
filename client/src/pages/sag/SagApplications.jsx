import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { Loader2, Search, ArrowRight, FileText } from "lucide-react";
import StatusStamp from "../../components/ui/StatusStamp";

const SagApplications = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "/api/sag/applications");
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      !search ||
      app.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.student?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    verified: applications.filter((a) => a.status === "verified").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Pending" },
    { key: "verified", label: "Verified" },
    { key: "rejected", label: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16213E]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-6 sm:p-8 mb-8">
        <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-2">
          PMSSS · SAG Review Queue
        </p>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#16213E]">
          Applications
        </h1>
      </div>

      <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#DCD6C8]">
          {[
            { label: "Total", count: counts.all },
            { label: "Pending", count: counts.submitted },
            { label: "Verified", count: counts.verified },
            { label: "Rejected", count: counts.rejected },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-5 text-center">
              <p className="font-serif-display text-2xl font-normal text-[#16213E] mb-1">
                {stat.count}
              </p>
              <p className="font-mono-data text-[10px] tracking-[0.15em] uppercase text-[#16213E]/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#16213E]/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-4 py-2.5 border-b border-[#DCD6C8] bg-transparent text-sm text-[#16213E] focus:outline-none focus:border-[#B8860B] transition-colors placeholder:text-[#16213E]/30"
          />
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                filter === f.key
                  ? "border-[#16213E] text-[#16213E]"
                  : "border-transparent text-[#16213E]/40 hover:text-[#16213E]/70"
              }`}
            >
              {f.label}
              <span className="font-mono-data text-[10px] ml-1.5 text-[#16213E]/30">
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-[#DCD6C8] rounded-sm py-16 text-center">
          <FileText className="w-10 h-10 text-[#B8860B]/40 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-serif-display text-lg font-normal text-[#16213E] mb-1">
            No applications found
          </h3>
          <p className="text-sm text-[#16213E]/40">
            {search ? "Try adjusting your search terms." : "No applications match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#DCD6C8]">
                  <th className="text-left px-6 py-3 font-mono-data text-[10px] font-semibold tracking-[0.15em] uppercase text-[#16213E]/40">Student</th>
                  <th className="text-left px-6 py-3 font-mono-data text-[10px] font-semibold tracking-[0.15em] uppercase text-[#16213E]/40">Email</th>
                  <th className="text-left px-6 py-3 font-mono-data text-[10px] font-semibold tracking-[0.15em] uppercase text-[#16213E]/40">Submitted</th>
                  <th className="text-left px-6 py-3 font-mono-data text-[10px] font-semibold tracking-[0.15em] uppercase text-[#16213E]/40">Status</th>
                  <th className="text-right px-6 py-3 font-mono-data text-[10px] font-semibold tracking-[0.15em] uppercase text-[#16213E]/40">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD6C8]">
                {filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#16213E]">
                      {app.student?.fullName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#16213E]/55">
                      {app.student?.email || "—"}
                    </td>
                    <td className="px-6 py-4 font-mono-data text-xs text-[#16213E]/50">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusStamp status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/sag/application/${app._id}`)}
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#16213E] hover:text-[#B8860B] transition-colors cursor-pointer"
                      >
                        View
                        <ArrowRight className="w-3.5 h-3.5 text-[#DCD6C8] group-hover:text-[#B8860B] group-hover:translate-x-0.5 transition-all" />
                      </button>
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

export default SagApplications;
