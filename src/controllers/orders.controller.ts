// src/controllers/order.controller.ts
import { Request, Response, NextFunction } from "express";
import { OrderImpl } from "../service/impl/orders.impl";
import { PlaceOrderDto } from "../dtos/order.dto";

export class OrderController {
  private service = new OrderImpl();

  // 1. Place a new order
  public placeOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Grab the authenticated user’s ID (set by your auth middleware)
      const userId = (req as any).user.id as number;
      const dto = req.body as PlaceOrderDto;
      const order = await this.service.placeOrder(userId, dto);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  };

  // 2. List all orders for the logged‐in user
  public getUserOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.id as number;
      const orders = await this.service.getUserOrders(userId);
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };

  // 3. Get a specific order (must belong to you)
  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.id as number;
      const orderId = Number(req.params.id);
      const order = await this.service.getOrderById(orderId, userId);
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };

  // 4. Cancel an order (only if not dispatched, only your own)
//   public cancelOrder = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const userId = (req as any).user.id as number;
//       const orderId = Number(req.params.id);
//       await this.service.cancelOrder(orderId, userId);
//       res.sendStatus(204);
//     } catch (err) {
//       next(err);
//     }
//   };

  // 5. (Admin) List every order in the system
  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orders = await this.service.getAllOrders();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };
}
