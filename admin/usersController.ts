import { Router } from "express";
import {
  getContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
} from "@/utils/database/requests";
import { verifyToken } from "@/auth/accesMidlware";
import { loginUser } from "@/auth/loginController";
import { refreshToken } from "@/auth/refreshTokenRotation";

const userContrRouter = Router();

userContrRouter.post("/login", loginUser);
userContrRouter.post("/refreshRotation", refreshToken);

userContrRouter.use(verifyToken);

userContrRouter.get("/verify", async (req, res) => {
  try {
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

userContrRouter.get("/users", async (req, res) => {
  try {
    const users = await getContacts();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:id - получить пользователя по ID
userContrRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await getContact(parseInt(req.params.id));
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /users - создать пользователя
userContrRouter.post("/users", async (req, res) => {
  try {
    const user = await addContact(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /users/:id - обновить пользователя
userContrRouter.put("/users/:id", async (req, res) => {
  try {
    const user = await updateContact(parseInt(req.params.id), req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /users/:id - удалить пользователя
userContrRouter.delete("/users/:id", async (req, res) => {
  try {
    const user = await deleteContact(parseInt(req.params.id));
    res.status(204).json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default userContrRouter;
