import mongoose from "mongoose";

const batchApplicationSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },
  studentName: { type: String, required: true },
  bankName: { type: String, default: "" },
  accountHolder: { type: String, default: "" },
  accountNumber: { type: String, default: "" },
  ifscCode: { type: String, default: "" },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  transactionId: { type: String },
  utrNumber: { type: String },
  paymentDate: { type: Date },
  failedReason: { type: String }
}, { _id: false });

const paymentBatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  parentBatchId: {
    type: String,
    default: null
  },
  applications: [batchApplicationSchema],
  totalStudents: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Generated", "Sent to Bank", "Processing", "Completed"],
    default: "Generated"
  }
}, { timestamps: true });

paymentBatchSchema.index({ parentBatchId: 1 });

const paymentBatchModel =
  mongoose.models.PaymentBatch ||
  mongoose.model("PaymentBatch", paymentBatchSchema);

export default paymentBatchModel;
