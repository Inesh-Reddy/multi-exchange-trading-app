import { Module } from '@nestjs/common';
import { MarketDataService, TradeService } from './market-data.service';
import { MarketDataRouter } from './market-data.router';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from 'src/db/db.trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [],
  providers: [MarketDataRouter, MarketDataService, TradeService],
  exports: [MarketDataRouter, MarketDataService, TradeService],
})
export class MarketDataModule {}
