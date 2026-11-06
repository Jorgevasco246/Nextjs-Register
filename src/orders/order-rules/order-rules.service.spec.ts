import { BadRequestException, ConflictException } from "@nestjs/common";
import { OrderEntity } from "../entities/order.entity";
import { OrderRulesService } from "./order-rules.service";
import { describe, it, expect } from "@jest/globals";

describe("OrderRulesService", () => {
  const service = new OrderRulesService();

  it("allows a pending order with a positive quantity", () => {
    const order = {
      quantity: 2,
      status: "pending",
    } as OrderEntity;

    expect(() => service.ensureCanBeMarkedAsReady(order)).not.toThrow();
  });

  it("rejects an order that is already ready", () => {
    const order = {
      quantity: 2,
      status: "ready",
    } as OrderEntity;

    expect(() => service.ensureCanBeMarkedAsReady(order)).toThrow(
      ConflictException,
    );
  });

  it("rejects an order with zero quantity", () => {
    const order = {
      quantity: 0,
      status: "pending",
    } as OrderEntity;

    expect(() => service.ensureCanBeMarkedAsReady(order)).toThrow(
      BadRequestException,
    );
  });
});
