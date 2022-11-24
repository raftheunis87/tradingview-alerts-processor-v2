import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { BybitModule } from './bybit/bybit.module';
import { TradesModule } from './trades/trades.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'accounts',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AccountsModule,
    BybitModule,
    TradesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
