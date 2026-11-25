import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
// alteracoes
import {loadEnvConfig} from "@next/env"
import { drizzle } from "drizzle-orm/neon-serverless";
import { relations as appRelations } from "@/database/schema";
import { authRelations } from "@/database/authSchema";
/* Por que estamos fazendo isso?
O Next.js carrega automaticamente as variáveis de ambiente durante a execução da aplicação. Entretanto, ferramentas executadas diretamente pelo terminal, como o CLI do Better Auth, podem precisar desse carregamento explícito para acessar o .env.local. */

loadEnvConfig(process.cwd());
neonConfig.webSocketConstructor = ws;
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL não foi configurada.");
}

export const pool = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle({
  client: pool,

  relations: {
    ...appRelations,
    ...authRelations,
  },
});

// import { drizzle } from "drizzle-orm/neon-serverless";
// const databaseUrl = process.env.DATABASE_URL;

// if (!databaseUrl) {
//   throw new Error("DATABASE_URL não foi definida.");
// }

// export const db = drizzle(databaseUrl);