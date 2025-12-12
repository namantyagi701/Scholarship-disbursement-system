import React from "react";
import { 
  Upload, Clock, CheckCircle, DollarSign, FileText, XCircle, TrendingUp 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {

  const navigate = useNavigate();
  
  // Sample student data
  const studentData = {
    name: "Naman",
    id: "PMSSS-2024-12345",
    applications: 3,
    verified: 15,
    pending: 3,
    amount: "₹45,000"
  };

  const documents = [
    { name: "Aadhar Card", status: "verified", date: "Nov 15, 2024" },
    { name: "Income Certificate", status: "verified", date: "Nov 15, 2024" },
    { name: "Domicile Certificate", status: "pending", date: "Nov 16, 2024" },
    { name: "Bank Passbook", status: "error", date: "Nov 17, 2024" }
  ];

  const activities = [
    { type: "success", text: "Income Certificate verified by SAG Bureau", time: "2 hours ago" },
    { type: "info", text: "Document #DOC-2024-1234 approved", time: "Yesterday, 3:45 PM" },
    { type: "error", text: "Bank Passbook verification failed - Re-upload required", time: "Nov 17, 2024" },
    { type: "info", text: "Payment processing initiated", time: "Nov 16, 2024" }
  ];

  const StatusBadge = ({ status }) => {
    const styles = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const MetricCard = ({ icon: Icon, label, value, subtitle }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const TimelineStep = ({ title, date, status }) => {
    const color = {
      completed: "bg-green-500",
      active: "bg-blue-600 animate-pulse",
      pending: "bg-gray-400"
    }[status];

    return (
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            {status === "completed" && <CheckCircle className="w-6 h-6 text-white" />}
            {status === "active" && <Clock className="w-6 h-6 text-white" />}
            {status === "pending" && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
          {status !== "pending" && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
        </div>

        <div className="pb-8">
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
      </div>
    );
  };
 
  return (
    <div className="p-6">

      {/* Banner */}
      <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome, {studentData.name}</h2>
        <p className="text-gray-600 text-sm mt-1">Student ID: {studentData.id}</p>

        <div className="flex gap-4 mt-4">
          <button onClick={() => navigate('/scholarship-application')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Submit New Application
          </button>

          <button onClick={() => navigate('/upload-docs')} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            Upload documents →
          </button>
          <button  onClick={() => navigate('/view-docs')} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            View Documents →
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard icon={FileText} label="Applications" value={studentData.applications} />
        <MetricCard icon={CheckCircle} label="Verified Documents" value={studentData.verified} />
        <MetricCard icon={Clock} label="Pending Verification" value={studentData.pending} />
        <MetricCard icon={DollarSign} label="Amount Received" value={studentData.amount} />
      </div>

      {/* Timeline + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Application Status Timeline */}
        <div className="bg-white rounded-lg border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Application Status</h3>

          <TimelineStep title="Document Submitted" date="Nov 15, 2024" status="completed" />
          <TimelineStep title="Under Verification (SAG)" date="Nov 16, 2024" status="active" />
          <TimelineStep title="Finance Approval" date="Awaiting" status="pending" />
          <TimelineStep title="Payment Released" date="Awaiting" status="pending" />
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Document Status</h3>

          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  {doc.status === "verified" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {doc.status === "pending" && <Clock className="w-5 h-5 text-yellow-500" />}
                  {doc.status === "error" && <XCircle className="w-5 h-5 text-red-500" />}

                  <div>
                    <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                    <p className="text-gray-500 text-xs">{doc.date}</p>
                  </div>
                </div>

                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
