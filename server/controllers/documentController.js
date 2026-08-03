import cloudinary from "../config/cloudinary.js";
import documentModel from "../models/documentModel.js";
import applicationModel from "../models/applicationModel.js";

export const getDocuments = async (req, res) => {
  try {
    const documents = await documentModel
      .find({ student: req.user._id })
      .populate("verifiedBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { documentType, applicationId, ocrExtractedText } = req.body;
    const ocrNameMatchScore = req.body.ocrNameMatchScore != null
      ? Number(req.body.ocrNameMatchScore)
      : undefined;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // 🔐 Check if application belongs to logged-in student
    const application = await applicationModel.findOne({
      _id: applicationId,
      student: req.user._id
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "Invalid application"
      });
    }

    // 🚫 Prevent upload after submission
    if (!["draft", "rejected"].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot upload after submission"
      });
    }

    // ☁️ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "pmsss_documents"
      }
    );

    // Check if document already exists (replace logic)
    let document = await documentModel.findOne({
      student: req.user._id,
      application: applicationId,
      documentType
    });

    if (document) {
      await cloudinary.uploader.destroy(document.cloudinaryPublicId);

      document.cloudinaryPublicId = result.public_id;
      document.cloudinaryUrl = result.secure_url;
      document.verificationStatus = "pending";
      document.rejectionReason = null;
      document.ocrExtractedText = ocrExtractedText;
      document.ocrNameMatchScore = ocrNameMatchScore;

      await document.save();
    } else {
      document = await documentModel.create({
        student: req.user._id,
        application: applicationId,
        documentType,
        cloudinaryPublicId: result.public_id,
        cloudinaryUrl: result.secure_url,
        ocrExtractedText,
        ocrNameMatchScore
      });
    }

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
