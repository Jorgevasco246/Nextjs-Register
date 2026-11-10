import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function createOrder(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  // Los campos llegan como texto: quantity y customerId se convierten a números.
  const item = String(formData.get("item") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const customerId = Number(formData.get("customerId"));

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // No se envía status NstJS crea el pedido como "pending".
    body: JSON.stringify({ item, quantity, customerId }),
  }).catch(() => null);

  if (response?.status === 201) redirect("/orders");
  if (response?.status === 401) redirect("/login");
  if (response?.status === 404) redirect("/orders/new?error=customer");
  if (response?.status === 400) redirect("/orders/new?error=invalid");

  redirect("/orders/new?error=1");
}

type NewOrderPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewOrderPage({ searchParams }: NewOrderPageProps) {
  const cookieStore = await cookies();
  if (!cookieStore.get("coffee_token")?.value) redirect("/login");

  const { error } = await searchParams;

  return (
    <main>
      <h1>Nuevo pedido</h1>
      {error === "customer" && <p role="alert">El cliente no existe. Revisa el ID del cliente.</p>}
      {error === "invalid" && <p role="alert">Datos inválidos. Revisa el producto, la cantidad y el cliente.</p>}
      {error === "1" && <p role="alert">No se pudo crear el pedido. Revisa la conexión e inténtalo de nuevo.</p>}

      <form action={createOrder}>
        <p>
          <label>
            Producto <input name="item" type="text" maxLength={80} required />
          </label>
        </p>
        <p>
          <label>
            Cantidad <input name="quantity" type="number" min={1} max={20} step={1} required />
          </label>
        </p>
        <p>
          <label>
            ID del cliente <input name="customerId" type="number" min={1} step={1} required />
          </label>
        </p>
        <button type="submit">Crear pedido</button>
      </form>

      <p>
        <Link href="/orders">Volver a pedidos</Link>
      </p>
    </main>
  );
}