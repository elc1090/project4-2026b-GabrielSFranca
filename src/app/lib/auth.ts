import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "@/database";
import * as authSchema from "@/database/authSchema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,

  secret: process.env.BETTER_AUTH_SECRET!,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  user: {
    modelName: "usuario",
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});