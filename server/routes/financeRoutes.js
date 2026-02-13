import express from "express";
import userAuth from "../middleware/userAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getApprovedApplications,
  disbursePayment,
  getPaymentHistory
} from "../controllers/financeController.js";

const financeRouter = express.Router();

financeRouter.use(userAuth);
financeRouter.use(roleMiddleware("finance"));

financeRouter.get("/approved-applications", getApprovedApplications);

financeRouter.put("/disburse/:id", disbursePayment);

financeRouter.get("/payment-history", getPaymentHistory);

export default financeRouter;
