import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors( { origin: 'https://localhost:8081' }));
  await app.listen(process.env.PORT || 3333);
}
bootstrap();
