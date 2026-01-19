// src/controllers/order.controller.ts
import { Request, Response, NextFunction } from "express";
import { OrderImpl } from "../service/impl/orders.impl";
import { PlaceOrderDto } from "../dtos/order.dto";
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from "../dtos/pagination.dto";

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
      const pagination = new PaginationQueryDto(
        req.query.page,
        req.query.limit
      );
      const { data, total } = await this.service.getUserOrders(
        userId,
        pagination.getSkip(),
        pagination.limit
      );
      const response = new PaginatedResponseDto(
        data,
        pagination.page,
        pagination.limit,
        total
      );
      res.status(200).json(response);
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
      const pagination = new PaginationQueryDto(
        req.query.page,
        req.query.limit
      );
      const { data, total } = await this.service.getAllOrders(
        pagination.getSkip(),
        pagination.limit
      );
      const response = new PaginatedResponseDto(
        data,
        pagination.page,
        pagination.limit,
        total
      );
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
