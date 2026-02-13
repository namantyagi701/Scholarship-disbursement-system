import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

  // 👤 Reference to the student who applied
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const applicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default applicationModel;
