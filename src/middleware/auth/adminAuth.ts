import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "@config/constants";

interface JwtPayload {
  username: string;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({ message: "Access Denied" });
    return;
  }

  const token = authHeader.substring(7); // Убираем "Bearer " из строки

  try {
    const verified = jwt.verify(token, config.ACCESS_SECRET) as JwtPayload;
    req.user = { username: verified.username };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Access Token" });
  }
};
