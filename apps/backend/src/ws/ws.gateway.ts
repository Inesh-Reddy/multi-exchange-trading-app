import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
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
    const checker: object = await this.jwt.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    if (!checker) {
      client.close();
    }
    const dataToSendToClient = JSON.stringify({
      data: `Client with token: ${token} connected successfully`,
    });
    client.send(dataToSendToClient);
  }

  @SubscribeMessage('todos')
  handleTodos(client: any, payload: any) {
    console.log('Got message from client:', payload);
    const data = this.marketData.getMarketData();
    return { event: 'todos', data: data };
  }
}
