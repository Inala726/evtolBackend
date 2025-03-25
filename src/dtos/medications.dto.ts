import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Medication } from "@prisma/client";

export class RegisterMedicineDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  weight!: number;

  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;
}
