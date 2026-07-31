import applicationModel from "../models/applicationModel.js";
import documentModel from "../models/documentModel.js";
import transporter from "../config/nodemailer.js";
import userModel from "../models/userModel.js";

// Get all submitted applications (pending SAG review)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await applicationModel
            .find({ status: { $in: ["submitted", "verified", "rejected"] } })
            .populate("student", "fullName email mobile aadhaarNumber aadhaarVerified")
            .sort({ createdAt: -1 });

        return res.json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single application with its documents
export const getSingleApplication = async (req, res) => {
    try {
        const application = await applicationModel
            .findById(req.params.id)
            .populate("student", "fullName email mobile aadhaarNumber aadhaarVerified")
            .populate("sagVerifiedBy", "fullName email");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        const documents = await documentModel.find({ application: application._id });

        return res.json({ success: true, application, documents });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Verify (approve) an application
export const verifyApplication = async (req, res) => {
    try {
        const application = await applicationModel
            .findById(req.params.id)
            .populate("student", "fullName email");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        if (application.status !== "submitted") {
            return res.status(400).json({
                success: false,
                message: `Cannot verify — current status is "${application.status}"`
            });
        }

        // Ensure all individual documents are approved before whole-application approval
        const documents = await documentModel.find({ application: application._id });
        const unapproved = documents.filter(doc => doc.verificationStatus !== "approved");
        if (unapproved.length > 0) {
            const pendingTypes = unapproved.map(d => d.documentType).join(", ");
            return res.status(400).json({
                success: false,
                message: `Cannot approve application — the following documents are not yet approved: ${pendingTypes}`
            });
        }

        application.status = "verified";
        application.sagVerifiedBy = req.user._id;
        application.sagVerifiedAt = new Date();
        await application.save();

        // Notify student
        if (application.student?.email) {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: application.student.email,
                subject: "Application Verified — PMSSS",
                text: `Dear ${application.student.fullName},\n\nYour scholarship application has been verified by SAG and forwarded for disbursement.\n\nRegards,\nSSP Team`
            });
        }

        return res.json({ success: true, message: "Application verified successfully", application });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Reject an application
export const rejectApplication = async (req, res) => {
    try {
        const { reason } = req.body;

        const application = await applicationModel
            .findById(req.params.id)
            .populate("student", "fullName email");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        if (application.status !== "submitted") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject — current status is "${application.status}"`
            });
        }

        application.status = "rejected";
        application.rejectionReason = reason || "No reason provided";
        application.sagVerifiedBy = req.user._id;
        application.sagVerifiedAt = new Date();
        await application.save();

        // Notify student
        if (application.student?.email) {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: application.student.email,
                subject: "Application Rejected — PMSSS",
                text: `Dear ${application.student.fullName},\n\nYour scholarship application has been rejected.\nReason: ${application.rejectionReason}\n\nPlease contact support for further details.\n\nRegards,\nSSP Team`
            });
        }

        return res.json({ success: true, message: "Application rejected", application });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Verify an individual document
export const verifyDocument = async (req, res) => {
    try {
        const document = await documentModel.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        document.verificationStatus = "approved";
        document.rejectionReason = undefined;
        document.verifiedBy = req.user._id;
        document.verifiedAt = new Date();
        await document.save();

        return res.json({ success: true, message: "Document verified successfully", document });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Reject an individual document
export const rejectDocument = async (req, res) => {
    try {
        const { reason } = req.body;

        const document = await documentModel.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        if (!reason) {
            return res.status(400).json({ success: false, message: "Rejection reason is required" });
        }

        document.verificationStatus = "rejected";
        document.rejectionReason = reason;
        document.verifiedBy = req.user._id;
        document.verifiedAt = new Date();
        await document.save();

        return res.json({ success: true, message: "Document rejected", document });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
