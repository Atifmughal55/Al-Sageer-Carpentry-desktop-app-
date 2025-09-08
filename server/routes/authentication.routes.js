import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginController,
  recoverPassword,
  registerController,
} from "../controllers/authentication.controllers.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPassword);
router.post("/recover-password", recoverPassword);
router.put("/change-password", changePassword);
export default router;
