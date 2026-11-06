import { Injectable } from "@nestjs/common";
import { OrdersService } from "../orders.service";

export interface OrdersSummary {
  total: number;
  pending: number;
  ready: number;
}

@Injectable()
export class OrdersSummaryService {
  constructor(private readonly ordersService: OrdersService) {}

  async getSummary(): Promise<OrdersSummary> {
    const orders = await this.ordersService.findAll();

    const total = orders.length;
    const pending = orders.filter((order) => order.status === "pending").length;
    const ready = orders.filter((order) => order.status === "ready").length;

    return {
      total,
      pending,
      ready,
    };
  }
}
