/**
 * @swagger
 * /evtol/v1/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Place a new order
 *     description: Create a new medication delivery order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicationId
 *                     - quantity
 *                   properties:
 *                     medicationId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data or insufficient stock
 *       401:
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get user orders (paginated)
 *     description: Retrieve orders for the authenticated user with pagination support
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page (max 100)
 *     responses:
 *       200:
 *         description: List of user orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       401:
 *         description: Unauthorized
 *
 * /evtol/v1/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a specific order
 *     description: Retrieve details of a specific order (must be user's own order)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - order does not belong to user
 *       404:
 *         description: Order not found
 *
 * /evtol/v1/orders/all:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders (paginated)
 *     description: Retrieve all orders in the system (admin endpoint with pagination support)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number (1-indexed)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page (max 100)
 *     responses:
 *       200:
 *         description: List of all orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       401:
 *         description: Unauthorized
 */

import express from "express";
import { OrderController } from "../controllers/orders.controller";
import { authenticateUser } from "../middleware/auth.middlewares";

const orderController = new OrderController();
const orderRoutes = express.Router();

orderRoutes.post("/", authenticateUser, orderController.placeOrder);

orderRoutes.get("/", authenticateUser, orderController.getUserOrders);

orderRoutes.get("/:id", authenticateUser, orderController.getOrderById);

// orderRoutes.delete("/:id", authenticateUser, orderController.cancelOrder);

orderRoutes.get("/all", authenticateUser, orderController.getAllOrders);

export default orderRoutes;
