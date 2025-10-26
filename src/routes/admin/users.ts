// src/routes/admin/users.ts
import { Router } from "express";
import { UsersController } from "../../admin/users/usersController";
import { verifyToken } from "../../middleware/auth/adminAuth";

const router = Router();
const usersController = new UsersController();

// Все маршруты защищены аутентификацией
router.use(verifyToken);

router.get("/verify", usersController.verify);
router.get("/users", usersController.getUsers);
router.get("/users/:id", usersController.getUser);
router.post("/users", usersController.createUser);
router.put("/users/:id", usersController.updateUser);
router.delete("/users/:id", usersController.deleteUser);

export default router;
