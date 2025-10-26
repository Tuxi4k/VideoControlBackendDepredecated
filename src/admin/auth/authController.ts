// src/admin/auth/authController.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { username, password } = req.body;
      const result = await this.authService.authenticateUser(
        username,
        password
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };
}
