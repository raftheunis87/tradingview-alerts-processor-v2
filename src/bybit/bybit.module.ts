import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BybitService } from './bybit.service';

@Module({
  providers: [BybitService],
  imports: [AccountsModule],
  exports: [BybitService],
})
export class BybitModule {}
