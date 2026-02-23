import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Pencil,
  Save,
  X,
  Loader2,
  FileText,
  CreditCard,
  BadgeCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";

const Profile = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContent);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  // Stats
  const [appStatus, setAppStatus] = useState(null);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(backendUrl + "/api/student/profile");
        if (data.success) {
          setProfile(data.user);
          setFullName(data.user.fullName || "");
          setMobile(data.user.mobile || "");
          setAadhaarNumber(data.user.aadhaarNumber || "");
        }

        // Fetch application status
        try {
          const appRes = await axios.get(backendUrl + "/api/student/application-status");
          if (appRes.data.success) setAppStatus(appRes.data.application);
        } catch {}

        // Fetch document count
        try {
          const docRes = await axios.get(backendUrl + "/api/student/documents");
          if (docRes.data.success) setDocCount(docRes.data.documents.length);
        } catch {}
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [backendUrl]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const payload = { fullName, mobile };
      if (!profile?.aadhaarVerified && aadhaarNumber) {
        payload.aadhaarNumber = aadhaarNumber;
      }

      const { data } = await axios.put(backendUrl + "/api/student/profile", payload);
      if (data.success) {
        toast.success(data.message);
        setEditing(false);
        getUserData();
        // Refresh profile
        const res = await axios.get(backendUrl + "/api/student/profile");
        if (res.data.success) setProfile(res.data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFullName(profile?.fullName || "");
    setMobile(profile?.mobile || "");
    setAadhaarNumber(profile?.aadhaarNumber || "");
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) return null;

  const createdDate = new Date(profile.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ---- Profile Header Card ---- */}
        <div className="relative overflow-hidden bg-white rounded-2xl border shadow-sm">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute top-6 right-6">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg transition"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg transition"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium bg-white text-blue-700 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Avatar + Name */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-white">
                  {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 pt-2">
                {editing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-xl font-bold text-gray-900 border-b-2 border-blue-400 bg-transparent outline-none pb-1 w-full max-w-xs"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-gray-900">
                    {profile.fullName}
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" /> Joined {createdDate}
                  </span>
                  <span className="capitalize inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {profile.role}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      profile.accountStatus === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {profile.accountStatus === "active" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {profile.accountStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ---- Left: Contact & Security ---- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
                Contact Information
              </h2>
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {profile.email}
                    </p>
                  </div>
                  {profile.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Mobile
                    </p>
                    {editing ? (
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="text-sm font-medium text-gray-800 border-b border-blue-300 bg-transparent outline-none w-full max-w-xs"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">
                        {profile.mobile || "—"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Aadhaar & Security */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">
                Identity & Security
              </h2>
              <div className="space-y-4">
                {/* Aadhaar */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      profile.aadhaarVerified
                        ? "bg-green-50"
                        : "bg-yellow-50"
                    }`}
                  >
                    {profile.aadhaarVerified ? (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Aadhaar Number
                    </p>
                    {editing && !profile.aadhaarVerified ? (
                      <input
                        type="text"
                        maxLength={12}
                        value={aadhaarNumber}
                        onChange={(e) =>
                          setAadhaarNumber(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter 12-digit Aadhaar"
                        className="text-sm font-medium text-gray-800 border-b border-blue-300 bg-transparent outline-none w-full max-w-xs tracking-widest"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 tracking-wide">
                        {profile.aadhaarNumber
                          ? `${profile.aadhaarNumber.slice(0, 4)} •••• ${profile.aadhaarNumber.slice(-4)}`
                          : "Not provided"}
                      </p>
                    )}
                  </div>
                  {profile.aadhaarVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>

                {/* Email Verification */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      profile.isEmailVerified ? "bg-green-50" : "bg-yellow-50"
                    }`}
                  >
                    <BadgeCheck
                      className={`w-5 h-5 ${
                        profile.isEmailVerified
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Email Verification
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {profile.isEmailVerified
                        ? "Email is verified"
                        : "Email not yet verified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Right: Stats & Quick Info ---- */}
          <div className="space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">
                  Application
                </h3>
              </div>
              {appStatus ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2.5 py-1 text-xs font-medium rounded-full border ${
                        appStatus.status === "disbursed"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : appStatus.status === "verified"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : appStatus.status === "rejected"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : appStatus.status === "submitted"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          appStatus.status === "disbursed"
                            ? "bg-emerald-500"
                            : appStatus.status === "verified"
                            ? "bg-green-500"
                            : appStatus.status === "rejected"
                            ? "bg-red-500"
                            : appStatus.status === "submitted"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      {appStatus.status.charAt(0).toUpperCase() +
                        appStatus.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(appStatus.updatedAt).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No application yet</p>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-sm">Documents</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {docCount}
                </span>
                <span className="text-sm text-gray-400">/ 6 uploaded</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(docCount / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900 text-sm">Account</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Account Status</p>
                  <p
                    className={`text-sm font-semibold capitalize ${
                      profile.accountStatus === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {profile.accountStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-sm font-medium text-gray-700">
                    {createdDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
