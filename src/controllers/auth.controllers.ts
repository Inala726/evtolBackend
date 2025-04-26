import { Response, Request, NextFunction } from "express";
import { LoginDTO, CreateUserDTO, VerifyEmailDTO } from "../dtos/users.dto";
import { AuthServiceImp } from "../service/impl/auth.impl";


export class AuthController {
  private authService: AuthServiceImp;

  constructor() {
    this.authService = new AuthServiceImp();
  }

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const { accessToken, refreshToken } = await this.authService.login(data);
      res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

   public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateUserDTO = req.body;
      const user = await this.authService.createUser(data);
      res.status(201).json({
        error: false,
        message: `Otp has been sent successfully to your email @ ${user.email}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: VerifyEmailDTO = req.body;
      const user = await this.authService.verifyEmail(data);
      res.status(201).json({
        error: false,
        message: `You have successfully registered`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
  
}
