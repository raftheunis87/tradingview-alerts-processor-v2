import { IsIn, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { Direction } from '../direction.enum';

export class CreateTradeDto {
  @IsNotEmpty()
  @IsString()
  stub: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsIn([Direction.LONG, Direction.SHORT])
  @IsLowercase()
  @IsNotEmpty()
  @IsString()
  direction: string;
}
