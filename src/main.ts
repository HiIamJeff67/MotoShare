import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import rawBody from "raw-body";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081',  // Allow specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use('/webhook', (req, res, next) => {
    const stripeSignature = req.headers['stripe-signature'];
    if (stripeSignature) {
      req.setEncoding('utf8'); // 確保正確的字元編碼
      rawBody(
        req,
        {
          length: req.headers['content-length'],
          encoding: req.headers['content-type']?.includes('text/plain') ? 'utf-8' : null, // 確保適配多種 Content-Type
        },
        (err, body) => {
          if (err) {
            console.error('Error parsing raw body:', err);
            return res.status(400).send('Invalid Webhook Body');
          }
          req.body = body; // 保存原始 body
          next();
        },
      );
    } else {
      next();
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
