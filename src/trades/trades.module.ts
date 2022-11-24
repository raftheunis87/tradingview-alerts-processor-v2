import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BybitModule } from 'src/bybit/bybit.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  controllers: [TradesController],
  providers: [TradesService],
  imports: [BybitModule],
})
export class TradesModule {}
