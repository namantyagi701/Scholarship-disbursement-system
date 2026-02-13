import express from "express";
import userAuth from "../middleware/userAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getProfile,
  updateProfile,
  verifyAadhaar,
  saveApplication,
  submitApplication,
  getApplicationStatus,
  getPaymentDetails,
} from "../controllers/studentController.js";



import { uploadDocument } from "../controllers/documentController.js";
import upload from "../middleware/multer.js";

const studentRouter = express.Router();

studentRouter.use(userAuth);
studentRouter.use(roleMiddleware("student"));

studentRouter.get("/profile", getProfile);

studentRouter.put("/profile", updateProfile);

studentRouter.post("/verify-aadhaar", verifyAadhaar);

studentRouter.post("/save-application", saveApplication);
studentRouter.post("/submit-application", submitApplication);

studentRouter.get("/application-status", getApplicationStatus);

studentRouter.get("/payment-details", getPaymentDetails);

studentRouter.post(
  "/upload-document", upload.single("file"), uploadDocument);

export default studentRouter;
