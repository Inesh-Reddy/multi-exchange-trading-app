import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataRouter } from './market-data.router';

@Module({
  controllers: [],
  providers: [MarketDataRouter, MarketDataService],
})
export class MarketDataModule {}
