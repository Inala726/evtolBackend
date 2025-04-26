import { User } from "@prisma/client";
import { CreateUserDTO, LoginDTO } from "../dtos/users.dto";

export interface AuthServices{
    createUser(data: CreateUserDTO):Promise<User>
    login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
}