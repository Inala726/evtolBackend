import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dtos/users.dto";
import { UserServices } from "../users.services";
import { db } from "../../config/db";
import { CustomError } from "../../utils/customError.utils";
import { hashPassword } from "../../utils/password.utils";

export class userServiceImplementation implements UserServices {
  async createUser(data: CreateUserDTO): Promise<User> {
    const isUserExist = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      throw new CustomError(409, "Oops email already taken");
    }

    const user = await db.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    return user;
  }

  async getAllUsers(skip?: number, take?: number): Promise<{ data: User[]; total: number }> {
    const [users, total] = await Promise.all([
      db.user.findMany({
        skip: skip || 0,
        take: take || 10,
        orderBy: { id: "desc" },
      }),
      db.user.count(),
    ]);
    return { data: users, total };
  }

  async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
    const isUserExist = await db.user.update({
      where: { id },
      data,
    });
    if (!isUserExist) {
      throw new CustomError(404, "User doesn't exist in the database");
    }
    const user = await db.user.update({
      where: { id },
      data,
    });
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.user.delete({
      where: { id },
    });
  }
}
