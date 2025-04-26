import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDTO{
    @IsNotEmpty()
    @Length(2, 50)
    firstName!:string

    @IsNotEmpty()
    @Length(2, 50)
    lastName!: string

    @IsEmail()
    email!: string

    @IsNotEmpty()
    @Length(6, 20)
    password!: string
}

export class LoginDTO{
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string
}

export class VerifyEmailDTO {
    @IsString()
    @IsEmail()
    email!: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp!: string;
  }
  
  export class EmailOtpDTO{
    @IsString()
    @IsEmail()
    email!: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    phoneNumber!: string;
  
  }