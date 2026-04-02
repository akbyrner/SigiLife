import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const dbUrl = process.env.NODE_ENV === "production"
  ? process.env.PROD_DATABASE_URL
  : process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("No DATABASE_URL found for current environment!");
}

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: {
    path: "server/prisma/migrations"
  },
  datasource: {
    url: dbUrl
  },
});