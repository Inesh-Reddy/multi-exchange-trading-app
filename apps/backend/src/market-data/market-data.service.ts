import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketDataService {
  getMarketData(): string {
    return 'market Data';
  }
}
