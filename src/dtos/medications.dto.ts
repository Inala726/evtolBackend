// import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

// export class RegisterMedicineDTO {
//   @IsNotEmpty()
//   @IsString()
//   name!: string;

//   @IsNotEmpty()
//   @IsNumber()
//   @Min(0)
//   weight!: number;

//   @IsNotEmpty()
//   @IsString()
//   code!: string;

//   @IsNotEmpty()
//   @IsNumber()
//   @Min(0)
//   quantity!: number;
// }

import {
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from "class-validator";

export class RegisterMedicineDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  weight!: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9_]+$/, {
    message:
      "Code may only contain uppercase letters, numbers, and underscores",
  })
  code!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}
