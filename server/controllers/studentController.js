import userModel from "../models/userModel.js";
import applicationModel from "../models/applicationModel.js";
import documentModel from "../models/documentModel.js";
import cloudinary from "../config/cloudinary.js";


const requiredDocuments = [
    "aadhaar",
    "income_certificate",
    "marksheet",
    "admission_letter",
    "bank_passbook",
    "caste_certificate"
]

export const getProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { fullName, mobile, aadhaarNumber } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.mobile = mobile || user.mobile;

        // Aadhaar editable only if not verified
        if (!user.aadhaarVerified && aadhaarNumber) {
            user.aadhaarNumber = aadhaarNumber;
        }

        await user.save();

        return res.json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const verifyAadhaar = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        if (!aadhaarNumber || aadhaarNumber.length !== 12) {
            return res.status(400).json({
                success: false,
                message: "Invalid Aadhaar number"
            });
        }

        const user = await userModel.findById(req.user._id);

        if (user.aadhaarVerified) {
            return res.status(400).json({
                success: false,
                message: "Aadhaar already verified"
            });
        }

        user.aadhaarNumber = aadhaarNumber;
        user.aadhaarVerified = true;

        await user.save();

        return res.json({
            success: true,
            message: "Aadhaar verified successfully"
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const saveApplication = async (req, res) => {
    try {
        const { formData } = req.body; // dynamic key-value pairs from the form

        if (!formData || typeof formData !== "object") {
            return res.status(400).json({
                success: false,
                message: "formData is required and must be an object"
            });
        }

        let application = await applicationModel.findOne({
            student: req.user._id
        });

        if (application) {
            if (application.status !== "draft") {
                return res.status(400).json({
                    success: false,
                    message: "Cannot update after submission"
                });
            }

            // Merge new fields into existing formData map
            for (const [key, value] of Object.entries(formData)) {
                application.formData.set(key, value);
            }

            await application.save();

            return res.json({
                success: true,
                message: "Application updated successfully",
                applicationId: application._id,
                application
            });
        }

        application = await applicationModel.create({
            student: req.user._id,
            status: "draft",
            formData
        });

        return res.status(201).json({
            success: true,
            message: "Application created successfully",
            applicationId: application._id,
            application
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Submits the application after validating all documents and aadhaar
export const submitApplication = async (req, res) => {
    try {
        const application = await applicationModel.findOne({
            student: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "No application found. Create one first."
            });
        }

        if (application.status !== "draft") {
            return res.status(400).json({
                success: false,
                message: "Application already submitted"
            });
        }

        const documents = await documentModel.find({ student: req.user._id });
        const uploadedTypes = documents.map(doc => doc.documentType);

        const missingDocs = requiredDocuments.filter(
            doc => !uploadedTypes.includes(doc)
        );

        if (missingDocs.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing documents: ${missingDocs.join(", ")}`
            });
        }

        const user = await userModel.findById(req.user._id);

        if (!user.aadhaarVerified) {
            return res.status(400).json({
                success: false,
                message: "Verify Aadhaar before submitting application"
            });
        }

        application.status = "submitted";
        await application.save();

        return res.json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getApplicationStatus = async (req, res) => {
    try {

        const application = await applicationModel
            .findOne({ student: req.user._id })
            .populate("sagVerifiedBy", "fullName email")
            .populate("disbursedBy", "fullName email");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.json({
            success: true,
            application
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getPaymentDetails = async (req, res) => {
    try {

        const application = await applicationModel.findOne({
            student: req.user._id
        });

        if (!application || application.status !== "disbursed") {
            return res.status(400).json({
                success: false,
                message: "Payment not processed yet"
            });
        }

        return res.json({
            success: true,
            transactionId: application.transactionId,
            disbursedAt: application.disbursedAt
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

