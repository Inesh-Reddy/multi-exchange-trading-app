import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    Options: {
      url: 'http://localhost:3001',
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
