import { OrderCard } from "../components/order-card";
import { sampleOrders } from "../data/sample-orders";

export default function OrdersPage() {
  return (
    <main>
      <h1>Pedidos</h1>
      <p>Datos temporales. Todavía no se consulta el backend.</p>
      <section className="orders-grid" aria-label="Listado de pedidos">
        {sampleOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>
    </main>
  );
}