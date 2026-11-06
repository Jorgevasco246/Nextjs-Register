import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrdersService } from "./orders.service";
import { describe, jest, beforeEach, it, expect } from "@jest/globals";
import { CustomerEntity } from "./entities/customer.entity";
import { OrderRulesService } from "./order-rules/order-rules.service";
import { OrderPreparationEstimateService } from "./order-preparation-estimate/order-preparation-estimate.service";

void describe("OrdersServiceTest", () => {
  let service: OrdersService;
  const repositoryMock = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn<(options: any) => Promise<OrderEntity | null>>(),
    update: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  };

  const customersRepositoryMock = {
    findOneBy: jest.fn(),
  };

  const orderRulesServiceMock = {
    ensureCanBeMarkedAsReady: jest.fn(),
  };

  const orderPreparationEstimateServiceMock = {
    estimate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: repositoryMock,
        },

        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: customersRepositoryMock,
        },

        {
          provide: OrderRulesService,
          useValue: orderRulesServiceMock,
        },

        {
          provide: OrderPreparationEstimateService,
          useValue: orderPreparationEstimateServiceMock,
        },
      ],
    }).compile();

    service = moduleRef.get(OrdersService);
  });

  it("returns an order when the id exists", async () => {
    // Arrange
    const orderMock = {
      id: 7,
      item: "Cappuccino",
      quantity: 2,
      status: "pending",
      customer: {
        id: 3,
        name: "Laura",
        email: "laura@example.com",
      },
    } as OrderEntity;

    repositoryMock.findOne.mockResolvedValue(orderMock);
    //Act
    const result = await service.findOne(1);

    // Assert
    expect(result).toEqual(orderMock);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 7 },
      relations: { customer: true },
    });

    it("throws NotFoundException when the order does not exist", async () => {
      // Arrange
      repositoryMock.findOne.mockResolvedValue(null);

      // Act and Assert
      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
