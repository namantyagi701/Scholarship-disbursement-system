import applicationModel from "../models/applicationModel.js";
import transporter from "../config/nodemailer.js";

// Get all verified (SAG-approved) applications ready for disbursement
export const getApprovedApplications = async (req, res) => {
    try {
        const applications = await applicationModel
            .find({ status: { $in: ["verified", "disbursed"] } })
            .populate("student", "fullName email mobile aadhaarNumber bankAccountNumber ifscCode accountHolderName")
            .populate("sagVerifiedBy", "fullName email")
            .sort({ sagVerifiedAt: -1 });

        return res.json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Disburse payment for a verified application
export const disbursePayment = async (req, res) => {
    try {
        const { transactionId } = req.body;

        if (!transactionId) {
            return res.status(400).json({ success: false, message: "Transaction ID is required" });
        }

        const application = await applicationModel
            .findById(req.params.id)
            .populate("student", "fullName email");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        if (application.status !== "verified") {
            return res.status(400).json({
                success: false,
                message: `Cannot disburse — current status is "${application.status}"`
            });
        }

        application.status = "disbursed";
        application.transactionId = transactionId;
        application.disbursedBy = req.user._id;
        application.disbursedAt = new Date();
        await application.save();

        // Notify student
        if (application.student?.email) {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: application.student.email,
                subject: "Scholarship Disbursed — PMSSS",
                text: `Dear ${application.student.fullName},\n\nYour scholarship has been successfully disbursed.\nTransaction ID: ${transactionId}\n\nRegards,\nSSP Team`
            });
        }

        return res.json({ success: true, message: "Payment disbursed successfully", application });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get payment history (all disbursed applications)
export const getPaymentHistory = async (req, res) => {
    try {
        const applications = await applicationModel
            .find({ status: "disbursed" })
            .populate("student", "fullName email mobile bankAccountNumber ifscCode accountHolderName")
            .populate("disbursedBy", "fullName email")
            .sort({ disbursedAt: -1 });

        return res.json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};