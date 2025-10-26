// src/admin/users/usersController.ts
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "@admin/database/userRepository";
import { Prisma } from "@prisma/client";

export class UsersController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
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
      const users = await this.userRepository.getContacts();
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
      const user = await this.userRepository.getContact(id);

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
      const userSaved = await this.userRepository.addContact(req.body);
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
      const updateData: Prisma.ContactUpdateInput = req.body;
      const userSaved = await this.userRepository.updateContact(id, updateData);
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
      const userSaved = await this.userRepository.deleteContact(id);
      res.status(204).json({ success: userSaved });
    } catch (error) {
      next(error);
    }
  };
}
