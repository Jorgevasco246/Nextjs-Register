import Link from "next/link";
import { redirect } from "next/navigation";
export const instant = false;

async function register(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${process.env.COFFEE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  // 201: cuenta creada. No se guarda cookie porque el registro no devuelve token.
  if (response?.status === 201) redirect("/login?registered=1");

  // 409: el email ya está registrado.
  if (response?.status === 409) redirect("/register?error=exists");

  // Cualquier otro caso: datos inválidos o problema de conexión.
  redirect("/register?error=1");
}

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Crear cuenta</h1>
      {error === "exists" && <p role="alert">Ese email ya está registrado. Prueba con otro o inicia sesión.</p>}
      {error === "1" && <p role="alert">No se pudo crear la cuenta. Revisar los datos o la conexión.</p>}

      <form action={register}>
        <p>
          <label>
            Email <input name="email" type="email" autoComplete="email" required />
          </label>
        </p>
        <p>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={15}
              required
            />
          </label>
        </p>
        <button type="submit">Crear cuenta</button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
      </p>
    </main>
  );
}
