import userModel from "../models/userModel.js";
import applicationModel from "../models/applicationModel.js";
import documentModel from "../models/documentModel.js";
import cloudinary from "../config/cloudinary.js";
import { getCurrentAcademicYear } from "../utils/academicYear.js";


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
        const { fullName, mobile, aadhaarNumber, bankAccountNumber, ifscCode, accountHolderName } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.mobile = mobile || user.mobile;

        // Bank details — locked once application is submitted/verified/disbursed
        if (bankAccountNumber !== undefined || ifscCode !== undefined || accountHolderName !== undefined) {
            const activeApplication = await applicationModel.findOne({
                student: user._id,
                academicYear: getCurrentAcademicYear(),
                status: { $in: ["submitted", "verified", "disbursed"] }
            });
            if (activeApplication) {
                return res.status(400).json({
                    success: false,
                    message: "Bank details cannot be changed while your application is under review or disbursed"
                });
            }
            if (bankAccountNumber !== undefined) user.bankAccountNumber = bankAccountNumber;
            if (ifscCode !== undefined) user.ifscCode = ifscCode;
            if (accountHolderName !== undefined) user.accountHolderName = accountHolderName;
        }

        // Aadhaar editable only if not verified
        if (!user.aadhaarVerified && aadhaarNumber) {
            // Check if another user already registered with this Aadhaar
            const existingAadhaar = await userModel.findOne({
                aadhaarNumber,
                _id: { $ne: user._id }
            });
            if (existingAadhaar) {
                return res.status(409).json({
                    success: false,
                    message: "This Aadhaar number is already registered with another account"
                });
            }
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

        // Check if another user already registered with this Aadhaar
        const existingAadhaar = await userModel.findOne({
            aadhaarNumber,
            _id: { $ne: user._id }
        });
        if (existingAadhaar) {
            return res.status(409).json({
                success: false,
                message: "This Aadhaar number is already registered with another account"
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
        const { formData, bankAccountNumber, ifscCode, accountHolderName } = req.body;

        if (!formData || typeof formData !== "object") {
            return res.status(400).json({
                success: false,
                message: "formData is required and must be an object"
            });
        }

        let application = await applicationModel.findOne({
            student: req.user._id,
            academicYear: getCurrentAcademicYear()
        });

        if (application) {
            if (!["draft", "rejected"].includes(application.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot update after submission"
                });
            }

            // Merge new fields into existing formData map
            for (const [key, value] of Object.entries(formData)) {
                application.formData.set(key, value);
            }

            // Update bank details (amount is set by SAG only)
            if (bankAccountNumber !== undefined) application.bankAccountNumber = bankAccountNumber;
            if (ifscCode !== undefined) application.ifscCode = ifscCode;
            if (accountHolderName !== undefined) application.accountHolderName = accountHolderName;

            await application.save();

            return res.json({
                success: true,
                message: "Application updated successfully",
                applicationId: application._id,
                application
            });
        }

        try {
            const pastApproved = await applicationModel.findOne({
                student: req.user._id,
                status: { $in: ["verified", "disbursed"] }
            }).sort({ createdAt: -1 });

            let prefilled = false;
            let initialFormData = formData;
            let initialBankAcc = bankAccountNumber;
            let initialIfsc = ifscCode;
            let initialAccName = accountHolderName;

            if (pastApproved && (!formData || Object.keys(formData).length === 0)) {
                const pastFormData = Object.fromEntries(
                    pastApproved.formData instanceof Map ? pastApproved.formData : Object.entries(pastApproved.formData || {})
                );
                initialFormData = pastFormData;
                initialBankAcc = pastApproved.bankAccountNumber;
                initialIfsc = pastApproved.ifscCode;
                initialAccName = pastApproved.accountHolderName;
                prefilled = true;
            }

            application = await applicationModel.create({
                student: req.user._id,
                academicYear: getCurrentAcademicYear(),
                status: "draft",
                formData: initialFormData,
                bankAccountNumber: initialBankAcc,
                ifscCode: initialIfsc,
                accountHolderName: initialAccName
            });

            return res.status(201).json({
                success: true,
                message: "Application created successfully",
                applicationId: application._id,
                application,
                prefilled
            });
        } catch (dbError) {
            if (dbError.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "You already have an application for this academic year."
                });
            }
            throw dbError;
        }

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
            student: req.user._id,
            academicYear: getCurrentAcademicYear()
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "No application found. Create one first."
            });
        }

        if (!["draft", "rejected"].includes(application.status)) {
            return res.status(400).json({
                success: false,
                message: "Application already submitted"
            });
        }

        const documents = await documentModel.find({ application: application._id });
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

        // Validate bank details are present before submission
        if (!application.bankAccountNumber || !application.ifscCode || !application.accountHolderName) {
            return res.status(400).json({
                success: false,
                message: "Bank details (account number, IFSC code, account holder name) are required before submission"
            });
        }

        application.status = "submitted";
        application.rejectionReason = undefined;
        application.sagVerifiedBy = undefined;
        application.sagVerifiedAt = undefined;
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

        let application = await applicationModel
            .findOne({ student: req.user._id, academicYear: getCurrentAcademicYear() })
            .populate("sagVerifiedBy", "fullName email")
            .populate("disbursedBy", "fullName email");

        if (!application) {
            // Auto-create draft from past application if it exists
            const pastApproved = await applicationModel.findOne({
                student: req.user._id,
                status: { $in: ["verified", "disbursed"] }
            }).sort({ createdAt: -1 });

            if (pastApproved) {
                const pastFormData = Object.fromEntries(
                    pastApproved.formData instanceof Map ? pastApproved.formData : Object.entries(pastApproved.formData || {})
                );

                application = await applicationModel.create({
                    student: req.user._id,
                    academicYear: getCurrentAcademicYear(),
                    status: "draft",
                    formData: pastFormData,
                    bankAccountNumber: pastApproved.bankAccountNumber,
                    ifscCode: pastApproved.ifscCode,
                    accountHolderName: pastApproved.accountHolderName
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Application not found"
                });
            }
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
            student: req.user._id,
            academicYear: getCurrentAcademicYear()
        });

        if (!application || application.status !== "disbursed") {
            return res.status(400).json({
                success: false,
                message: "Payment not processed yet"
            });
        }

        return res.json({
            success: true,
            amount: application.amount,
            bankAccountNumber: application.bankAccountNumber,
            ifscCode: application.ifscCode,
            accountHolderName: application.accountHolderName,
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

export const getApplicationHistory = async (req, res) => {
    try {
        const applications = await applicationModel
            .find({ student: req.user._id })
            .sort({ academicYear: -1 });

        return res.json({
            success: true,
            applications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

