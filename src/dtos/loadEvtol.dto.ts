import {
    IsArray,
    ArrayMinSize,
    ValidateNested,
    IsInt,
    Min,
  } from "class-validator";
  import { Type } from "class-transformer";
  
  export class LoadItemDto {
    @IsInt()
    medicationId!: number;
  
    @IsInt()
    @Min(1)
    quantity!: number;
  }
  
  export class LoadEVTOLDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => LoadItemDto)
    items!: LoadItemDto[];
  }
  