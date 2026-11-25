import { loadEnvConfig } from "@next/env";
import { sql } from "drizzle-orm";

async function main() {
  loadEnvConfig(process.cwd());

  const { db } = await import("../src/database/index");

  await db.execute(sql`SELECT 1`);

  console.log("Conexão com Neon estabelecida com sucesso.");
}

main().catch((error) => {
  console.error("Erro ao conectar com o Neon:", error);
  process.exitCode = 1;
});