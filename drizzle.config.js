import "dotenv/config";

export default {
  schema:
    process.env.NODE_ENV === "dev"
      ? "./src/database/schema.ts"
      : "./dist/database/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
