import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MarketDataModule } from 'src/market-data/market-data.module';

@Module({
  imports: [
    MarketDataModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [WsGateway, ConfigService],
})
export class WsModule {}
