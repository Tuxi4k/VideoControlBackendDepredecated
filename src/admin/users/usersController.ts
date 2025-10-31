import { Request, Response, NextFunction } from "express";
import { Requests } from "@/admin/database/requests";
import type { Contact } from "@/database/schema"; // Используем Drizzle типы

export class UsersController {
  private Requests: Requests;

  constructor() {
    this.Requests = new Requests();
  }

  verify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.json({ status: "ok", user: req.user });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.Requests.getContacts();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.Requests.getContact(id);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userSaved = await this.Requests.addContact(req.body);
      res.status(201).json({ success: userSaved });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updateData: Partial<Contact> = req.body; // Используем Drizzle тип
      const userSaved = await this.Requests.updateContact(id, updateData);
      res.json({ success: userSaved });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userSaved = await this.Requests.deleteContact(id);
      res.status(204).json({ success: userSaved });
    } catch (error) {
      next(error);
    }
  };
}
