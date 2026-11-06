import { Injectable } from "@nestjs/common";
import { OrderEntity } from "../entities/order.entity";

@Injectable()
export class OrderPreparationEstimateService {
  estimate(order: OrderEntity): number {
    //si el pedido esta listo son 0 minutos restantes
    //si el estado es ready es 0 sino (:) es 3 mas la cantidad de la order por 2
    const estimatedTime = order.status === "ready" ? 0 : 3 + order.quantity * 2;

    return estimatedTime;
  }
}
