import "dotenv/config"

const config = {
  PORT: process.env.PORT || 3000,

  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000"],

  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_IDS: process.env.TELEGRAM_CHAT_IDS
    ? process.env.TELEGRAM_CHAT_IDS.split(",")
    : [],

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_TO: process.env.EMAIL_TO,

  SITE_ADDRESS: process.env.SITE_ADDRESS || "http://localhost:3000",

  // JWT
  ACCESS_SECRET: process.env.ACCESS_SECRET || Math.random().toString(),
  REFRESH_SECRET: process.env.REFRESH_SECRET || Math.random().toString(),
  ACCESS_EXPIRES: process.env.ACCESS_EXPIRES || "15m",
  REFRESH_EXPIRES: process.env.REFRESH_EXPIRES || "2h",
};

export default config;
