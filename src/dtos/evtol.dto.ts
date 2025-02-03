import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min, MaxLength } from "class-validator";
import { ModelType } from "@prisma/client"; 

export class RegistereVTOLDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serialNumber!: string;

  @IsEnum(ModelType)
  model!: ModelType;

  @IsInt()
  @Min(0)
  @Max(100)
  battery!: number;
}
