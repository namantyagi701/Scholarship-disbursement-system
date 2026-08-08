import applicationModel from "../models/applicationModel.js";
import paymentBatchModel from "../models/paymentBatchModel.js";
import transporter from "../config/nodemailer.js";

// Get all verified (SAG-approved) applications ready for disbursement
export const getApprovedApplications = async (req, res) => {
    try {
        const applications = await applicationModel
            .find({ status: { $in: ["verified", "disbursed"] } })
            .populate("student", "fullName email mobile aadhaarNumber")
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
            .populate("student", "fullName email mobile")
            .populate("disbursedBy", "fullName email")
            .sort({ disbursedAt: -1 });

        return res.json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Batch Payment Functions ───────────────────────────────────────────

// Helper: Generate next batch ID
const generateBatchId = async () => {
    const year = new Date().getFullYear();
    const lastBatch = await paymentBatchModel
        .findOne({ batchId: { $regex: `^BATCH-${year}-` } })
        .sort({ createdAt: -1 });

    let counter = 1;
    if (lastBatch) {
        const parts = lastBatch.batchId.split("-");
        counter = parseInt(parts[2], 10) + 1;
    }
    return `BATCH-${year}-${String(counter).padStart(4, "0")}`;
};

// Helper: Random failure reasons for bank simulation
const FAILURE_REASONS = [
    "Insufficient funds in disbursement account",
    "Invalid IFSC code",
    "Account number mismatch",
    "Beneficiary account frozen",
    "Bank server timeout",
    "NEFT/RTGS processing failure"
];

// POST — Generate a payment batch from selected application IDs
export const generatePaymentBatch = async (req, res) => {
    try {
        const { applicationIds } = req.body;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ success: false, message: "No applications selected" });
        }

        const applications = await applicationModel
            .find({ _id: { $in: applicationIds }, status: "verified", batchId: null })
            .populate("student", "fullName email");

        const skippedCount = applicationIds.length - applications.length;

        if (applications.length === 0) {
            return res.status(400).json({
                success: false,
                message: skippedCount > 0
                    ? `All ${skippedCount} selected application(s) are already in another batch.`
                    : "No eligible applications found. Only verified, unbatched applications can be batched.",
                skippedCount
            });
        }

        const batchId = await generateBatchId();

        const batchApplications = applications.map((app) => ({
            application: app._id,
            studentName: app.student?.fullName || "Unknown",
            bankName: app.formData?.get?.("bankName") || "N/A",
            accountHolder: app.accountHolderName || "",
            accountNumber: app.bankAccountNumber || "",
            ifscCode: app.ifscCode || "",
            amount: app.amount || 0,
            paymentStatus: "Pending"
        }));

        const totalAmount = batchApplications.reduce((sum, a) => sum + a.amount, 0);

        const batch = await paymentBatchModel.create({
            batchId,
            generatedBy: req.user._id,
            generatedAt: new Date(),
            applications: batchApplications,
            totalStudents: batchApplications.length,
            totalAmount,
            status: "Generated"
        });

        // Update each application with the batchId
        await applicationModel.updateMany(
            { _id: { $in: applications.map((a) => a._id) } },
            { $set: { batchId, financeStatus: "Pending" } }
        );

        // Generate CSV content
        const csvHeader = "Application ID,Student Name,Bank Name,Account Holder,Account Number,IFSC,Scholarship Amount";
        const csvRows = batchApplications.map((a) =>
            `${a.application},${a.studentName},${a.bankName},${a.accountHolder},${a.accountNumber},${a.ifscCode},${a.amount}`
        );
        const csvContent = [csvHeader, ...csvRows].join("\n");

        return res.json({
            success: true,
            message: "Payment batch generated successfully",
            batch,
            csvContent,
            fileName: `payment_batch_${batchId}.csv`,
            skippedCount
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT — Forward batch to bank (simulated processing)
export const forwardToBank = async (req, res) => {
    try {
        const batch = await paymentBatchModel.findOne({ batchId: req.params.batchId });

        if (!batch) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }

        if (batch.status !== "Generated") {
            return res.status(400).json({
                success: false,
                message: `Cannot forward — batch status is "${batch.status}"`
            });
        }

        // Step 1: Sent to Bank
        batch.status = "Sent to Bank";
        await batch.save();

        // Step 2: Processing
        batch.status = "Processing";
        await batch.save();

        // Step 3: Simulate bank processing for each application
        const now = new Date();
        for (let i = 0; i < batch.applications.length; i++) {
            const entry = batch.applications[i];
            const isFailed = Math.random() < 0.1; // ~10% failure rate

            if (isFailed) {
                entry.paymentStatus = "Failed";
                entry.failedReason = FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];

                // Update application document
                await applicationModel.findByIdAndUpdate(entry.application, {
                    financeStatus: "Failed"
                });
            } else {
                const txnId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
                const utr = `UTR${Math.floor(Math.random() * 1e12).toString().padStart(12, "0")}`;

                entry.paymentStatus = "Paid";
                entry.transactionId = txnId;
                entry.utrNumber = utr;
                entry.paymentDate = now;

                // Update application document
                await applicationModel.findByIdAndUpdate(entry.application, {
                    status: "disbursed",
                    financeStatus: "Paid",
                    transactionId: txnId,
                    utrNumber: utr,
                    paymentDate: now,
                    disbursedBy: req.user._id,
                    disbursedAt: now
                });
            }
        }

        // Step 4: Completed
        batch.status = "Completed";
        await batch.save();

        const paidCount = batch.applications.filter((a) => a.paymentStatus === "Paid").length;
        const failedCount = batch.applications.filter((a) => a.paymentStatus === "Failed").length;

        return res.json({
            success: true,
            message: `Batch processed: ${paidCount} paid, ${failedCount} failed`,
            batch,
            paidCount,
            failedCount
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET — Get all payment batches
export const getPaymentBatches = async (req, res) => {
    try {
        const batches = await paymentBatchModel
            .find()
            .populate("generatedBy", "fullName email")
            .sort({ createdAt: -1 });

        return res.json({ success: true, batches });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET — Get single batch details
export const getBatchDetails = async (req, res) => {
    try {
        const batch = await paymentBatchModel
            .findOne({ batchId: req.params.batchId })
            .populate("generatedBy", "fullName email");

        if (!batch) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }

        return res.json({ success: true, batch });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET — Download batch CSV
export const downloadBatchCsv = async (req, res) => {
    try {
        const batch = await paymentBatchModel.findOne({ batchId: req.params.batchId });

        if (!batch) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }

        const csvHeader = "Application ID,Student Name,Bank Name,Account Holder,Account Number,IFSC,Scholarship Amount,Payment Status,Transaction ID,UTR Number";
        const csvRows = batch.applications.map((a) =>
            `${a.application},${a.studentName},${a.bankName},${a.accountHolder},${a.accountNumber},${a.ifscCode},${a.amount},${a.paymentStatus},${a.transactionId || ""},${a.utrNumber || ""}`
        );
        const csvContent = [csvHeader, ...csvRows].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=payment_batch_${batch.batchId}.csv`);
        return res.send(csvContent);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// POST — Retry failed payments from a completed batch
export const retryFailedPayments = async (req, res) => {
    try {
        const sourceBatch = await paymentBatchModel.findOne({ batchId: req.params.batchId });

        if (!sourceBatch) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }

        if (sourceBatch.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Can only retry failed payments from a completed batch"
            });
        }

        const failedEntries = sourceBatch.applications.filter((a) => a.paymentStatus === "Failed");

        if (failedEntries.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No failed payments to retry in this batch"
            });
        }

        const newBatchId = await generateBatchId();

        const retryApplications = failedEntries.map((entry) => ({
            application: entry.application,
            studentName: entry.studentName,
            bankName: entry.bankName,
            accountHolder: entry.accountHolder,
            accountNumber: entry.accountNumber,
            ifscCode: entry.ifscCode,
            amount: entry.amount,
            paymentStatus: "Pending"
        }));

        const totalAmount = retryApplications.reduce((sum, a) => sum + a.amount, 0);

        const retryBatch = await paymentBatchModel.create({
            batchId: newBatchId,
            generatedBy: req.user._id,
            generatedAt: new Date(),
            parentBatchId: sourceBatch.batchId,
            applications: retryApplications,
            totalStudents: retryApplications.length,
            totalAmount,
            status: "Generated"
        });

        // Reset failed applications' financeStatus and update batchId
        const failedAppIds = failedEntries.map((e) => e.application);
        await applicationModel.updateMany(
            { _id: { $in: failedAppIds } },
            { $set: { financeStatus: "Pending", batchId: newBatchId } }
        );

        return res.json({
            success: true,
            message: `Retry batch ${newBatchId} created with ${retryApplications.length} applications`,
            batch: retryBatch
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};