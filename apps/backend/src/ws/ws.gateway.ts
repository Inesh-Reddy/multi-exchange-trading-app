import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { MarketDataService } from 'src/market-data/market-data.service';

@WebSocketGateway({ path: '/md' }) // your FE connects here
export class MarketDataGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly marketData: MarketDataService) {}

  afterInit() {
    console.log('✅ WS Gateway ready');
    // pipe Binance trades into our gateway
    this.marketData.getMarketData().on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      const payload = {
        type: 'marketData',
        payload: {
          symbol: msg.s,
          price: parseFloat(msg.p),
          qty: parseFloat(msg.q),
          ts: msg.T,
        },
      };
      this.server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    });
  }

  handleConnection(client: WebSocket) {
    console.log('🔌 FE connected');
  }

  handleDisconnect(client: WebSocket) {
    console.log('❌ FE disconnected');
  }

  @SubscribeMessage('subscribe')
  onSubscribe(client: WebSocket, data: any) {
    console.log('📩 FE subscription:', data);
    // (later you can filter by symbol here)
  }
}
