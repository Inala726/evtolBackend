// import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min, MaxLength } from "class-validator";
// import { ModelType } from "@prisma/client";

// export class RegistereVTOLDto {
//   @IsEnum(ModelType)
//   model!: ModelType;

//   @IsInt()
//   @Min(0)
//   @Max(100)
//   battery!: number;
// }
import {
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { ModelType } from "@prisma/client";

export class RegistereVTOLDto {
  @IsEnum(ModelType)
  model!: ModelType;

  @IsNumber()
  @Min(0)
  @Max(100)
  battery!: number;

  @IsNumber()
  @Min(0)
  @Max(500)
  weightLimit!: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;
}
