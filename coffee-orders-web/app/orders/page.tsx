import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderCard from "../components/order-card";
import RefreshOrders from "../components/refresh-orders/refresh-orders";
import type { OrderSummary } from "../types/order-summary";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("coffee_token");
  redirect("/login");
}

type OrdersPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  const { status } = await searchParams;
  const selectedStatus = status === "pending" || status === "ready" ? status : undefined;
  const endpoint = selectedStatus
    ? `/orders/search?status=${selectedStatus}&limit=20`
    : "/orders";

  const response = await fetch(`${process.env.COFFEE_API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/login");

  const data = response?.ok ? await response.json().catch(() => null) : null;
  const orders: OrderSummary[] | null = Array.isArray(data) ? data : null;

  return (
    <main>
      <h1>Pedidos</h1>
      <form action={logout}>
        <button type="submit">Cerrar sesión</button>
      </form>

      <p>
        <Link href="/orders/new">Nuevo pedido</Link>
      </p>

      <nav aria-label="Filtrar pedidos">
        <Link href="/orders" aria-current={!selectedStatus ? "page" : undefined}>
          Todos
        </Link>
        <Link href="/orders?status=pending" aria-current={selectedStatus === "pending" ? "page" : undefined}>
          Pendientes
        </Link>
        <Link href="/orders?status=ready" aria-current={selectedStatus === "ready" ? "page" : undefined}>
          Listos
        </Link>
      </nav>
      <RefreshOrders />
      {selectedStatus && <p>Hasta 20 pedidos para este filtro.</p>}

      {orders === null && <p role="alert">No se pudieron consultar los pedidos.</p>}
      {orders?.length === 0 && <p>No hay pedidos para mostrar.</p>}
      {orders && orders.length > 0 && (
        <section className="orders-grid" aria-label="Listado de pedidos">
          {orders.map(({ id, item, quantity, status }) => (
            <OrderCard key={id} order={{ id, item, quantity, status }} />
          ))}
        </section>
      )}
    </main>
  );
}
