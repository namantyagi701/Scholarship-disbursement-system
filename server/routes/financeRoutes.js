import express from "express";
import userAuth from "../middleware/userAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getApprovedApplications,
  disbursePayment,
  getPaymentHistory,
  generatePaymentBatch,
  forwardToBank,
  getPaymentBatches,
  getBatchDetails,
  downloadBatchCsv,
  retryFailedPayments
} from "../controllers/financeController.js";

const financeRouter = express.Router();

financeRouter.use(userAuth);
financeRouter.use(roleMiddleware("finance"));

financeRouter.get("/approved-applications", getApprovedApplications);

financeRouter.put("/disburse/:id", disbursePayment);

financeRouter.get("/payment-history", getPaymentHistory);

// Batch payment routes
financeRouter.post("/generate-batch", generatePaymentBatch);
financeRouter.put("/forward-to-bank/:batchId", forwardToBank);
financeRouter.get("/batches", getPaymentBatches);
financeRouter.get("/batch/:batchId", getBatchDetails);
financeRouter.get("/batch/:batchId/csv", downloadBatchCsv);
financeRouter.post("/batch/:batchId/retry-failed", retryFailedPayments);

export default financeRouter;

