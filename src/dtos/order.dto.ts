import { IsNumber, IsPositive } from "class-validator";

export class createOrderDTO {
  @IsNumber()
  medicationId!: number;

  @IsNumber()
  @IsPositive()
  quantity!: number;
}

export class orderItemsDTO{
    
}