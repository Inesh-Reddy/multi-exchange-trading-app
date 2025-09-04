import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from 'src/db/db.trade.entity';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async saveTrade(symbol: string, price: number, qty: number, ts: Date) {
    const trade = this.tradeRepo.create({ symbol, price, qty, ts });
    return this.tradeRepo.save(trade);
  }

  async getTrades(symbol: string) {
    return this.tradeRepo.find({ where: { symbol } });
  }
}

@Injectable()
export class MarketDataService {
  constructor(private readonly tradeService: TradeService) {}
  getMarketData(): WebSocket {
    const ws = new WebSocket(
      'wss://stream.testnet.binance.vision/ws/btcusdt@trade',
    );
    ws.on('open', () => {
      console.log('✅ Connected to Binance WebSocket');
    });

    ws.on('message', async (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        // console.log(msg);
        const symbol = msg.s;
        const price = parseFloat(msg.p);
        const qty = parseFloat(msg.q);
        const ts = new Date(msg.T);

        await this.tradeService.saveTrade(symbol, price, qty, ts);
      } catch (err) {
        console.error('❌ Error handling trade', err);
      }
    });

    ws.on('error', (err) => {
      console.error('❌ Binance WS error:', err);
    });
    return ws;
  }
}
