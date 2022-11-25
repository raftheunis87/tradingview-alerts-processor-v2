import { Injectable } from '@nestjs/common';
import { BybitService } from 'src/bybit/bybit.service';
import { Direction } from './direction.enum';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradesService {
  constructor(private bybitService: BybitService) {}

  async create(createTradeDto: CreateTradeDto): Promise<void> {
    const { stub, symbol, size, direction } = createTradeDto;

    if (Direction.LONG == direction) {
      return this.bybitService.enterLongPosition(
        stub,
        symbol,
        parseFloat(size),
      );
    }

    if (Direction.CLOSE == direction) {
      return this.bybitService.closeLongPosition(stub, symbol);
    }

    return;
  }
}
