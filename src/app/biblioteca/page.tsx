import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BibliotecaPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Minha biblioteca</h1>

      <p>Olá, {session.user.name}!</p>
    </main>
  );
}