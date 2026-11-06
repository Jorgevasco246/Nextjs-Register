import { OrderEntity } from "../entities/order.entity";
import { describe, it, expect } from "@jest/globals";
import { OrderPreparationEstimateService } from "./order-preparation-estimate.service";

describe("OrderPreparationEstimateServiceTest", () => {
  const service = new OrderPreparationEstimateService();

  it("Return order stimate in 0 because status is ready", () => {
    const orderMock = {
      quantity: 2,
      status: "ready",
      id: 1,
    } as OrderEntity;

    expect(() => service.estimate(orderMock)).toBe({
      estimatedMinute: 7,
      orderId: 1,
      status: "ready",
    });
  });
});
