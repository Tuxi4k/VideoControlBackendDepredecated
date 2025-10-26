// src/types/requests.ts
import { Prisma } from "@prisma/client";

export interface Contact {
  id: number;
  email?: string | null;
  fio: string;
  agreement: string;
  phone: string;
  address: string;
  house: string;
  tags?: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormData {
  fio: string;
  phone: string;
  address: string;
  house: string;
  agreement: string;
  email?: string;
}

export interface CreateContactData {
  fio: string;
  phone: string;
  address: string;
  house: string;
  agreement: string;
  email?: string;
  tags?: Prisma.JsonValue;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  lastToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// JWT типы
export interface JwtPayload {
  username: string;
  iat?: number;
  exp?: number;
}

// Расширяем типы Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
