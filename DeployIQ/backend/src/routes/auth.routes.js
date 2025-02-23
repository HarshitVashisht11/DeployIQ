import { Router } from "express";
const router = Router();
import authController from "../controllers/auth.controller.js";
const { signup, login } = authController;

router.post("/signup", signup);
router.post("/login", login);

export default router;
