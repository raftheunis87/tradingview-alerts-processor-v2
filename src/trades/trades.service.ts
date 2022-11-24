import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { BybitService } from 'src/bybit/bybit.service';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradesService {
  private readonly logger = new Logger(TradesService.name);

  constructor(private bybitService: BybitService) {}

  async create(createTradeDto: CreateTradeDto) {
    const { stub, symbol, size, direction } = createTradeDto;
    // TODO: open or close a position

  }
}
