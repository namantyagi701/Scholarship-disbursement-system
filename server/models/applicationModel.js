import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

  // 👤 Reference to the student who applied
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  academicYear: {
    type: String,
    required: true
  },

  formData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  //  Application workflow status
  status: {
    type: String,
    enum: [
      "draft",              // student filling form
      "submitted",          // submitted by student
      "verified",           // approved by SAG
      "rejected",           // rejected by SAG
      "disbursed"           // payment completed
    ],
    default: "draft"
  },

  // SAG verification details
  sagVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  sagVerifiedAt: {
    type: Date
  },

  // ❌ If rejected
  rejectionReason: {
    type: String
  },

  // 💵 Scholarship amount requested
  amount: {
    type: Number
  },

  // 🏦 Bank details (filled by student, shown to finance)
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

  // 💰 Finance details
  transactionId: {
    type: String
  },

  disbursedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  disbursedAt: {
    type: Date
  }

}, { timestamps: true });

applicationSchema.index({ student: 1, academicYear: 1 }, { unique: true });

const applicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default applicationModel;
