import { Order } from "@prisma/client";
import { PlaceOrderDto } from "../dtos/order.dto";

export interface orderServices {
  placeOrder(userId: number, dto: PlaceOrderDto): Promise<Order & { items: any[] }>;
}
