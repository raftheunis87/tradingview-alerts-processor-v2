import { IsIn, IsLowercase, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Direction } from '../direction.enum';

export class CreateTradeDto {
  @IsNotEmpty()
  @IsString()
  stub: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsOptional()
  @IsString()
  size: string;

  @IsIn([Direction.LONG, Direction.CLOSE])
  @IsLowercase()
  @IsNotEmpty()
  @IsString()
  direction: string;
}
