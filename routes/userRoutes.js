import { Router } from "express";
import { userRegistration, userLogin, changeUserPassword} from "../controllers/userControllers.js";

const router = Router();

//public routes
router.post("/register", userRegistration)
router.post("/login", userLogin)

//protected routes
router.post("/changepassword", changeUserPassword)



export default router;