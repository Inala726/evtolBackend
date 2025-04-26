import { db } from "../../config/db";
import { CustomError } from "../../utils/customError.utils";
import { StatusCodes } from "http-status-codes";
import { PlaceOrderDto } from "../../dtos/order.dto";
import { Order } from "@prisma/client";
import { orderServices } from "../orders.services";

export class OrderImpl implements orderServices {
  async placeOrder(userId: number, dto: PlaceOrderDto): Promise<Order & { items: any[] }> {
    return db.$transaction(async (tx) => {
      const meds = await tx.medication.findMany({
        where: { id: { in: dto.items.map((i) => i.medicationId) } },
        select: { id: true, quantity: true },
      });

      for (const item of dto.items) {
        const med = meds.find((m) => m.id === item.medicationId);
        if (!med)
          throw new CustomError(
            StatusCodes.NOT_FOUND,
            `Medication ${item.medicationId} not found`
          );
        if ((med.quantity ?? 0) < item.quantity)
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            `Insufficient stock for medication ${item.medicationId}`
          );
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
}
