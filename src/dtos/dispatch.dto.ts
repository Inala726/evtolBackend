import { IsInt } from "class-validator";

export class DispatchOrderDto {
  @IsInt()
  orderId!: number;
}
