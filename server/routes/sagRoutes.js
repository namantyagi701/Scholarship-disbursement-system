import express from "express";
import userAuth from "../middleware/userAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getAllApplications,
  getSingleApplication,
  verifyApplication,
  rejectApplication
} from "../controllers/sagController.js";

const sagRouter = express.Router();

sagRouter.use(userAuth);
sagRouter.use(roleMiddleware("sag"));

sagRouter.get("/applications", getAllApplications);

sagRouter.get("/application/:id", getSingleApplication);

sagRouter.put("/verify/:id", verifyApplication);

sagRouter.put("/reject/:id", rejectApplication);

export default sagRouter;
