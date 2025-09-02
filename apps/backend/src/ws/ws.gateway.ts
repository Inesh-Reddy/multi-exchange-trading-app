import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
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

  @SubscribeMessage('message')
  handleMessage(client: any, payload: IncomingMessage): any {
    console.log(payload.headers.token);
    return payload.headers.token;
  }
}
