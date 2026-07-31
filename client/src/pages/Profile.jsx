import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Pencil,
  Save,
  X,
  Loader2,
  FileText,
  BadgeCheck,
} from "lucide-react";

import StatusStamp from "../components/ui/StatusStamp";
import LedgerRow from "../components/ui/LedgerRow";

// same palette as StudentDashboard:
// ink #16213E · gold #B8860B · green #2F6F4F · maroon #8B2E2E · paper #FAF8F3

const Profile = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContent);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");

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

        try {
          const appRes = await axios.get(backendUrl + "/api/student/application-status");
          if (appRes.data.success) setAppStatus(appRes.data.application);
        } catch {}

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
        <Loader2 className="w-6 h-6 animate-spin text-[#16213E]" />
      </div>
    );
  }

  if (!profile) return null;

  const createdDate = new Date(profile.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF8F3] p-4 sm:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">

        {/* ---- Identity card header ---- */}
        <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm">
          <div className="flex flex-wrap items-start justify-between gap-6 px-6 sm:px-8 py-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 border-2 border-[#16213E] flex items-center justify-center shrink-0">
                <span className="font-serif-display text-2xl text-[#16213E]">
                  {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-1">
                  Registered Applicant
                </p>
                {editing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="font-serif-display text-xl text-[#16213E] border-b-2 border-[#B8860B] bg-transparent outline-none pb-1 w-full max-w-xs"
                  />
                ) : (
                  <h1 className="font-serif-display text-xl sm:text-2xl text-[#16213E]">
                    {profile.fullName}
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#6B6558]">
                  <span className="font-mono-data">Since {createdDate}</span>
                  <span className="capitalize">{profile.role}</span>
                  <span
                    className="inline-flex items-center gap-1 font-medium"
                    style={{
                      color: profile.accountStatus === "active" ? "#2F6F4F" : "#8B2E2E",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          profile.accountStatus === "active" ? "#2F6F4F" : "#8B2E2E",
                      }}
                    />
                    {profile.accountStatus}
                  </span>
                </div>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-[#16213E] text-[#16213E] hover:bg-[#16213E] hover:text-white rounded-sm transition"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium border border-[#DCD6C8] text-[#6B6558] hover:bg-[#F3F0E8] rounded-sm transition"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium bg-[#16213E] hover:bg-[#0F1729] text-white rounded-sm transition disabled:opacity-50"
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

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* ---- Left: ledgers ---- */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact */}
            <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-6 sm:p-8">
              <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-4">
                Contact Information
              </p>
              <div>
                <LedgerRow label="Email">
                  <span className="text-sm text-[#16213E] font-medium truncate">
                    {profile.email}
                  </span>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: profile.isEmailVerified ? "#2F6F4F" : "#B8860B" }}
                  >
                    {profile.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </LedgerRow>

                <LedgerRow label="Mobile">
                  {editing ? (
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="text-sm font-medium text-[#16213E] border-b border-[#B8860B] bg-transparent outline-none w-40 text-right"
                    />
                  ) : (
                    <span className="text-sm font-medium text-[#16213E]">
                      {profile.mobile || "—"}
                    </span>
                  )}
                </LedgerRow>
              </div>
            </div>

            {/* Identity & Security */}
            <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-6 sm:p-8">
              <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-4">
                Identity &amp; Security
              </p>
              <div>
                <LedgerRow label="Aadhaar">
                  {editing && !profile.aadhaarVerified ? (
                    <input
                      type="text"
                      maxLength={12}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="12-digit number"
                      className="font-mono-data text-sm text-[#16213E] border-b border-[#B8860B] bg-transparent outline-none w-40 text-right tracking-widest"
                    />
                  ) : (
                    <span className="font-mono-data text-sm text-[#16213E]">
                      {profile.aadhaarNumber
                        ? `${profile.aadhaarNumber.slice(0, 4)} •••• ${profile.aadhaarNumber.slice(-4)}`
                        : "Not provided"}
                    </span>
                  )}
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: profile.aadhaarVerified ? "#2F6F4F" : "#B8860B" }}
                  >
                    {profile.aadhaarVerified ? "Verified" : "Pending"}
                  </span>
                </LedgerRow>

                <LedgerRow label="Email Verification">
                  <span
                    className="text-sm font-medium inline-flex items-center gap-1.5"
                    style={{ color: profile.isEmailVerified ? "#2F6F4F" : "#B8860B" }}
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {profile.isEmailVerified ? "Confirmed" : "Not confirmed"}
                  </span>
                </LedgerRow>
              </div>
            </div>
          </div>

          {/* ---- Right: status stamps ---- */}
          <div className="space-y-6">

            {/* Application status */}
            <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-5">
              <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-4">
                Application
              </p>
              {appStatus ? (
                <div className="space-y-3">
                  <StatusStamp status={appStatus.status} />
                  <p className="text-xs text-[#8A8374]">
                    Updated{" "}
                    {new Date(appStatus.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#8A8374]">No application yet</p>
              )}
            </div>

            {/* Documents */}
            <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#16213E]" strokeWidth={1.5} />
                <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374]">
                  Documents
                </p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif-display text-3xl text-[#16213E]">
                  {docCount}
                </span>
                <span className="text-sm text-[#8A8374]">of 6 filed</span>
              </div>
              <div className="w-full bg-[#EDE9DE] h-1 rounded-full mt-3">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${(docCount / 6) * 100}%`, backgroundColor: "#B8860B" }}
                />
              </div>
            </div>

            {/* Account */}
            <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-5">
              <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-[#8A8374] mb-3">
                Account
              </p>
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#8A8374]">Status</span>
                  <span
                    className="text-sm font-semibold capitalize inline-flex items-center gap-1"
                    style={{ color: profile.accountStatus === "active" ? "#2F6F4F" : "#8B2E2E" }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {profile.accountStatus}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#8A8374]">Member Since</span>
                  <span className="font-mono-data text-sm text-[#16213E]">{createdDate}</span>
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