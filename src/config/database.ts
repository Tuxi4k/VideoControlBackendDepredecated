// src/config/database.ts
import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    throw error;
  }
};

export default prisma;
