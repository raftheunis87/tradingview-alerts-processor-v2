import { Body, Controller, Post } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Post()
  create(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.create(createTradeDto);
  }
}
