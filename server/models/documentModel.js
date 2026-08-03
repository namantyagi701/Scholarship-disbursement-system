import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({

  // 👤 Student who uploaded the document
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 📌 Application this document belongs to
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  // Type of document
  documentType: {
    type: String,
    enum: [
      "aadhaar",
      "income_certificate",
      "marksheet",
      "admission_letter",
      "bank_passbook",
      "caste_certificate"
    ],
    required: true
  },

  // ☁️ Cloudinary Public ID (used to delete/update file)
  cloudinaryPublicId: {
    type: String,
    required: true
  },

  // ☁️ Secure URL from Cloudinary
  cloudinaryUrl: {
    type: String,
    required: true
  },

  // 📦 Optional file metadata
  fileSize: {
    type: Number
  },

  fileFormat: {
    type: String
  },

  // 🏢 SAG verification status
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  // ❌ If rejected
  rejectionReason: {
    type: String
  },

  // 👨‍💼 SAG officer who verified/rejected
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // 🕒 When verified/rejected
  verifiedAt: {
    type: Date
  },

  // 🔍 OCR verification data (Aadhaar image uploads only)
  ocrExtractedText: {
    type: String
  },

  ocrNameMatchScore: {
    type: Number
  }

}, { timestamps: true });


// Prevent duplicate document type per application
documentSchema.index(
  { student: 1, application: 1, documentType: 1 },
  { unique: true }
);

const documentModel =
  mongoose.models.Document ||
  mongoose.model("Document", documentSchema);

export default documentModel;
