import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import rawbody from 'raw-body';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081',  // Allow specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use('/webhook', (req, res, next) => {
    if (req.headers['stripe-signature']) {
      rawbody(req, {
        length: req.headers['content-length'],
        encoding: req.headers['content-encoding'] || 'utf-8',
      }, (err, body) => {
        if (err) {
          return next(err);
        }
        req.body = body; // 將原始 body 賦值到請求中
        next();
      });
    } else {
      next();
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
