// src/utils/logger.ts
export const logger = {
  info: (message: string, meta?: any): void => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || "");
  },

  error: (message: string, error?: any): void => {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || ""
    );
  },

  warn: (message: string, meta?: any): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || "");
  },
};
