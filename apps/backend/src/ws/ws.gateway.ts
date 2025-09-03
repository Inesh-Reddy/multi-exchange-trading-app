import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MarketDataRouter } from 'src/market-data/market-data.router';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private marketData: MarketDataRouter,
  ) {}

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const token = request.headers['token'] as string;

    try {
      const checker: { any } = await this.jwt.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!checker) {
        client.close();
        return;
      }

      client.send(JSON.stringify({ data: 'Client connected successfully' }));

      client.onmessage = (raw) => {
        console.log('Got message from client:', raw.data);

        const ws = this.marketData.getMarketData();
        ws.onmessage = (event) => {
          const msgToSend: object = {
            type: 'trade',
            payload: event.data,
          };
          client.send(JSON.stringify(msgToSend));
        };
      };
    } catch (error) {
      console.log(error);
      client.close();
    }
  }
}
