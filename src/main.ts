import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081',  // Allow specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(
    bodyParser.json({
      verify: (req: any, res, buf: Buffer) => {
        if (req.originalUrl === '/webhook/stripePaymentIntent') {
          req.rawBody = buf;
        }
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
