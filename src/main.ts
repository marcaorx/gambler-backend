import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
  });
  process.env.PORT ? await app.listen(process.env.PORT) : await app.init();
  module.exports = server;
}

bootstrap();