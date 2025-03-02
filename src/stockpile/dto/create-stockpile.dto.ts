import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateStockpileDto {
  @IsOptional()
  @IsUUID()
  taskId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quant: number;

  @IsOptional()
  description: string;
}
