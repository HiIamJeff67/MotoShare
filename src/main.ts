import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import rawBody from 'raw-body';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081',  // Allow specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use('/webhook', (req, res, next) => {
    // 使用 raw-body 處理原始請求
    rawBody(req, {
      length: req.headers['content-length'],
      encoding: req.headers['content-type'],
    }, (err, body) => {
      if (err) {
        return next(err);
      }
      req.body = body; // 保存原始請求體
      next();
    });
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
