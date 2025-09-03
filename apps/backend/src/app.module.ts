import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { MarketDataModule } from './market-data/market-data.module';
import { WsModule } from './ws/ws.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './db/db.trade.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
    }),
    MarketDataModule,
    WsModule,
    DbModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Trade],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    DbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
