import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { db } from "../../config/db";
import { VerifyEmailDTO, LoginDTO, CreateUserDTO } from "../../dtos/users.dto";
import { welcomeEmail, sendOtpEmail } from "../../ui/Email";
import { CustomError } from "../../utils/customError.utils";
import { generateOTP } from "../../utils/generateSerialnumber.utils";
import { comparePassword, hashPassword } from "../../utils/password.utils";
import { AuthServices } from "../auth.services";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export class AuthServiceImp implements AuthServices {
  generateAcessToken(userId: number, name: string, role:string): string {
    return jwt.sign({ id: userId, name }, process.env.JWT_SECRET || "", {
      expiresIn: '1h',
    });
  }

  generateRefreshToken(userId: number, name: string, role:string): string {
    return jwt.sign({ id: userId, name }, process.env.JWT_SECRET || "", {
      expiresIn: '30 days',
    });
  }

  generateOtpExpiration() {
    return new Date(Date.now() + 10 * 60 * 1000);
  }

  async verifyEmail(data: VerifyEmailDTO): Promise<User> {
    const user = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
    }
    if (user.emailVerified) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
    }
    if (!user.otp || !user.otpExpiry) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "OTP is not available for this user"
      );
    }

    const isOtpValid = await comparePassword(data.otp, user.otp);
    if (!isOtpValid) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }

    const isExpiredOtp = user.otpExpiry < new Date();

    if (isExpiredOtp) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    await welcomeEmail({
      to: updatedUser.email,
      subject: "Welcome to Futurerify",
      name: updatedUser.firstName + " " + updatedUser.lastName,
    });

    return updatedUser;
  }

  async login(
    data: LoginDTO
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid password or email");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid password or email");
    }

    const fullName = user.firstName + " " + user.lastName;
    const accessToken = this.generateAcessToken(user.id, fullName, user.role);
    const refreshToken = this.generateRefreshToken(user.id, fullName, user.role);

    return { accessToken, refreshToken };
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const otp = generateOTP();
    const isUserExist = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      throw new CustomError(StatusCodes.CONFLICT, "Oops, email already taken");
    }

    const hashedOtp = await hashPassword(otp);
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await db.$transaction(async (transaction) => {
          const user = await transaction.user.create({
            data: {
              email: data.email,
              password: await hashPassword(data.password),
              firstName: data.firstName,
              lastName: data.lastName, 
              otp: hashedOtp,
              otpExpiry: this.generateOtpExpiration(),
            },
          });

          await sendOtpEmail({
            to: data.email,
            subject: "Verify your email",
            otp,
          });
          return user;
        });
      } catch (error) {
        console.warn(`Retry ${attempt} due to transaction failure`, error);
        if (attempt === maxRetries) {
          throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to create user after multiple retries"
          );
        }
      }
    }
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unexpected error during user creation"
    );
  }
}
