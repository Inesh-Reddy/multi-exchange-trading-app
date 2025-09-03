import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Trade } from './db.trade.entity';
import { TimescaleInitService } from './db.timescale-init.service';
import { MarketDataModule } from 'src/market-data/market-data.module';

@Module({
  imports: [
    MarketDataModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Trade]),
  ],
  providers: [TimescaleInitService],
  exports: [TypeOrmModule],
})
export class DbModule {}
