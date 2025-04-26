// import { IsNumber, IsPositive } from "class-validator";

// export class createOrderDTO {
//   @IsNumber()
//   medicationId!: number;

//   @IsNumber()
//   @IsPositive()
//   quantity!: number;
// }

// export class orderItemsDTO{
    
// }

import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @IsInt()
  medicationId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class PlaceOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
