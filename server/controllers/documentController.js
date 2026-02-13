import cloudinary from "../config/cloudinary.js";
import documentModel from "../models/documentModel.js";
import applicationModel from "../models/applicationModel.js";

export const uploadDocument = async (req, res) => {
  try {
    const { documentType, applicationId } = req.body;

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
    if (application.status !== "draft") {
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

      await document.save();
    } else {
      document = await documentModel.create({
        student: req.user._id,
        application: applicationId,
        documentType,
        cloudinaryPublicId: result.public_id,
        cloudinaryUrl: result.secure_url
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
