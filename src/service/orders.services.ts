import { Order, OrderItem } from "@prisma/client";
import { PlaceOrderDto } from "../dtos/order.dto";

export interface orderServices {
    placeOrder(userId: number, dto: PlaceOrderDto): Promise<Order & { items: OrderItem[] }>;
    getOrderById(orderId: number, userId?: number): Promise<Order & { items: OrderItem[] }>;
    getUserOrders(userId: number): Promise<(Order & { items: OrderItem[] })[]>;
    getAllOrders(): Promise<(Order & { items: OrderItem[] })[]>;      // admin
    // cancelOrder(orderId: number, userId: number): Promise<void>;      // optional
  }
  
