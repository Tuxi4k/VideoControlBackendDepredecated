import { Router } from "express";
import adminRoutes from "./admin";
import clientRoutes from "./client/forms";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);

export default router;
