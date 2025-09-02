import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { MarketDataModule } from './market-data/market-data.module';
import { WsModule } from './ws/ws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
    }),
    MarketDataModule,
    WsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
