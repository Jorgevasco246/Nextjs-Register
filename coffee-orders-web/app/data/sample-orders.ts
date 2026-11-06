import type { OrderSummary } from "../types/order-summary";

export const sampleOrders: OrderSummary[] = [
  { id: 1, item: "Cappuccino", quantity: 2, status: "pending" },
  { id: 2, item: "Americano", quantity: 1, status: "ready" },
  { id: 3, item: "Latte", quantity: 3, status: "pending" },
];