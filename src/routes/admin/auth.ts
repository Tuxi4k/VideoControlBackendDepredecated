// src/routes/admin/auth.ts
import { Router } from "express";
import { AuthController } from "../../admin/auth/authController";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
