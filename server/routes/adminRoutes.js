import express from "express";
import userAuth from "../middleware/userAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getAllUsers,
  suspendUser,
  activateUser,
  deleteUser
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(userAuth);
adminRouter.use(roleMiddleware("admin"));

adminRouter.get("/users", getAllUsers);

adminRouter.put("/suspend/:id", suspendUser);

adminRouter.put("/activate/:id", activateUser);

adminRouter.delete("/delete/:id", deleteUser);

export default adminRouter;
