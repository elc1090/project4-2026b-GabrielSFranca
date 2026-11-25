import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

const connDBUrl = process.env.DATABASE_URL;

if (!connDBUrl) {
  throw new Error("DATABASE_URL não foi encontrada.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database",
  out: "./drizzle",
  dbCredentials: {
    url: connDBUrl,
  },
});