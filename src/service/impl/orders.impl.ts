import { Order, OrderItem } from "@prisma/client";
import { PlaceOrderDto } from "../../dtos/order.dto";
import { orderServices } from "../orders.services";
import { db } from "../../config/db";
import { CustomError } from "../../utils/customError.utils";
import { StatusCodes } from "http-status-codes";

export class OrderImpl implements orderServices {
  async placeOrder(
    userId: number,
    dto: PlaceOrderDto
  ): Promise<Order & { items: OrderItem[] }> {
    return await db.$transaction(async (tx) => {
      const meds = await tx.medication.findMany({
        where: { id: { in: dto.items.map((i) => i.medicationId) } },
        select: { id: true, quantity: true },
      });
      for (const item of dto.items) {
        const med = meds.find((m) => m.id === item.medicationId);
        if (!med) {
          throw new CustomError(
            StatusCodes.NOT_FOUND,
            `Medication ${item.medicationId} not found`
          );
        }
        if ((med.quantity ?? 0) < item.quantity) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            `Insufficient stock for medication ${item.medicationId}`
          );
        }
      }
      for (const item of dto.items) {
        await tx.medication.update({
          where: { id: item.medicationId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          items: {
            create: dto.items.map((i) => ({
              medicationId: i.medicationId,
              quantity: i.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return order;
    });
  }

  
  async getOrderById(
    orderId: number,
    userId?: number
  ): Promise<Order & { items: OrderItem[] }> {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Order not found");
    }
    if (userId && order.userId !== userId) {
      throw new CustomError(StatusCodes.FORBIDDEN, "Access denied");
    }
    return order;
  }


  async getUserOrders(
    userId: number
  ): Promise<(Order & { items: OrderItem[] })[]> {
    return db.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { orderDate: "desc" },
    });
  }

 
  async getAllOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    return db.order.findMany({
      include: {
        items: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { orderDate: "desc" },
    });
  }

//   async cancelOrder(orderId: number, userId: number): Promise<void> {
//     // 5a. Fetch the order and its dispatch status
//     const order = await db.order.findUnique({
//       where: { id: orderId },
//       include: { dispatch: true, items: true },
//     });
//     if (!order) {
//       throw new CustomError(StatusCodes.NOT_FOUND, "Order not found");
//     }
//     if (order.userId !== userId) {
//       throw new CustomError(StatusCodes.FORBIDDEN, "Not your order");
//     }
//     if (order.dispatch) {
//       throw new CustomError(
//         StatusCodes.BAD_REQUEST,
//         "Order already dispatched and cannot be cancelled"
//       );
//     }

//     // 5b. Restore stock and delete the order in one transaction
//     await db.$transaction(async (tx) => {
//       for (const item of order.items) {
//         await tx.medication.update({
//           where: { id: item.medicationId },
//           data: { quantity: { increment: item.quantity } },
//         });
//       }
//       await tx.order.delete({ where: { id: orderId } });
//     });
//   }
}
