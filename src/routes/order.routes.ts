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
