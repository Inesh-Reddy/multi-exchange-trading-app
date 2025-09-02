import { Inject } from '@nestjs/common';
import { Query, Router } from 'nestjs-trpc';
import { MarketDataService } from './market-data.service';
import { z } from 'zod';

@Router({ alias: 'data' })
export class MarketDataRouter {
  constructor(
    @Inject(MarketDataService) private marketDataService: MarketDataService,
  ) {}

  @Query({
    output: z.string(),
  })
  getMarketData() {
    return this.marketDataService.getMarketData();
  }
}
