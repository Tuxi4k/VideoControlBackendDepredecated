// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import config from "@config/constants";

export interface JwtPayload {
  username: string;
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
