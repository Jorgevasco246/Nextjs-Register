type OrdersSummaryProps = {
  total: number;
  pending: number;
  ready: number;
};

export function OrdersSummary({ total, pending, ready }: OrdersSummaryProps) {
  return (
    <section className="orders-summary">
      <p>Total de pedidos: {total}</p>
      <p>Pendientes: {pending}</p>
      <p>Listos: {ready}</p>
    </section>
  );
}