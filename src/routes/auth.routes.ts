import { AuthController } from "../controllers/auth.controllers";
import express from "express";

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post("/login", authController.login);

authRouter.post("/register", authController.createUser);

authRouter.post("/verify-email", authController.verifyEmail);
export default authRouter;
