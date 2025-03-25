import { Orders } from "@prisma/client";
import { createOrderDTO } from "../dtos/order.dto";

export interface OrderServices{
    createOrders(data:createOrderDTO):Promise<Orders>
    getAllOrders():Promise<Orders[]>
    getOrdersByID(id: number): Promise<Orders | null>
}