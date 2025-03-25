import { User } from "@prisma/client";
import { CreateUserDTO } from "../dtos/users.dto";

export interface UserServices {
  createUser(data: CreateUserDTO): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
