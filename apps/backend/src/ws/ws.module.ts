import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [WsGateway],
})
export class WsModule {}
