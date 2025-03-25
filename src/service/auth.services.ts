import { User } from "@prisma/client";
import { CreateUserDTO } from "../dtos/users.dto";

export interface AuthServices{
    createUser(data: CreateUserDTO):Promise<User>
}