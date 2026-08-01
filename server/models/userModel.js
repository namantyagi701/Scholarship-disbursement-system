import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName: {
    type: String,
    required: true,
    trim: true
  },

  // 📧 Used for login & communication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // 📱 For OTP / notifications
  mobile: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Invalid mobile number']
  },

  // 🔐 Hashed password (hashing will be done in controller)
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // 🎭 Role-based authentication
  // Controls dashboard access & permissions
  role: {
    type: String,
    enum: ["student", "sag", "finance", "admin"],
    default: "student"
  },

  // 🆔 Aadhaar number (only required for students)
  // Should be encrypted before saving (handled in controller)
  aadhaarNumber: {
    type: String,
    unique: true,
    sparse: true   // Allows null for non-student roles
  },

  // ✅ Indicates whether Aadhaar is verified
  aadhaarVerified: {
    type: Boolean,
    default: false
  },

  // 📩 Email verification status
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // � Email verification OTP
  verifyOtp: {
    type: String,
    default: ''
  },

  verifyOtpExpireAt: {
    type: Number,
    default: 0
  },

  // 🔑 Password reset OTP
  resetOtp: {
    type: String,
    default: ''
  },

  resetOtpExpireAt: {
    type: Number,
    default: 0
  },

  // 🏦 Bank details (saved to profile, pre-filled into applications)
  bankAccountNumber: {
    type: String,
    trim: true
  },

  ifscCode: {
    type: String,
    trim: true,
    uppercase: true
  },

  accountHolderName: {
    type: String,
    trim: true
  },

  // 🚦 Account control (admin can suspend/block users)
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "blocked"],
    default: "active"
  }

}, { timestamps: true });

const userModel =
    mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
