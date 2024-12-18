import { Router } from "express";
import {
  userRegistration,
  userLogin,
  changeUserPassword,
  userProfile,
  sendUserPasswordResetEmail,
  resetUserPassword,
} from "../controllers/userControllers.js";
import authenticated from "../middlewares/authMiddleware.js";

const router = Router();

//public routes
router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/password")
router.post("/passwordreset/email", sendUserPasswordResetEmail)
router.post("/passwordreset/:id/:token",resetUserPassword)

//protected routes
router.post("/changepassword", authenticated, changeUserPassword);
router.get("/profile", authenticated, userProfile);

export default router;
