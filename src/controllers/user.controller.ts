import { Response, Request, NextFunction } from "express";
import { userServiceImplementation } from "../service/impl/users.impl";
import { CreateUserDTO } from "../dtos/users.dto";
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from "../dtos/pagination.dto";

export class UserController {
  private userService: userServiceImplementation;

  constructor() {
    this.userService = new userServiceImplementation();
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as CreateUserDTO;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };
  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const pagination = new PaginationQueryDto(
        req.query.page,
        req.query.limit
      );
      const { data, total } = await this.userService.getAllUsers(
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
    } catch (error) {
      next(error);
    }
  };
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body as Partial<CreateUserDTO>;
      const updateUser = await this.userService.updateUser(userId, userData);
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  };
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.deleteUser(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
