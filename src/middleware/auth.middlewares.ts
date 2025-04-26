import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  userAuth?: string;
}

export const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      res.status(401).json({ message: "Authorization required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "", (err, decode) => {
      if (err) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
      }

      const payload = decode as JwtPayload;
      req.userAuth = payload.id;
      next();
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
