"use client";
import { authClient } from "@/app/lib/auth-client";

export default function LoginPage() {
  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/biblioteca",
    });
  }

  return (
    <main>
      <h1>App Filmes</h1>

      <p>Entre para acessar sua biblioteca.</p>

      <button onClick={handleGoogleLogin}>
        Continuar com Google
      </button>
    </main>
  );
}