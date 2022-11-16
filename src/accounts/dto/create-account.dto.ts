import { IsIn, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { Exchange } from '../exchange.enum';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  stub: string;

  @IsIn([Exchange.BYBIT])
  @IsLowercase()
  @IsNotEmpty()
  @IsString()
  exchange: Exchange;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  secret: string;
}
