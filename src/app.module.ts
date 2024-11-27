import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { PassengerModule } from './passenger/passenger.module';
import { ConfigModule } from '@nestjs/config';
import { PurchaseOrderModule } from './purchaseOrder/purchaseOrder.module';
import { RidderModule } from './ridder/ridder.module';
import { SupplyOrderModule } from './supplyOrder/supplyOrder.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { PassengerInviteModule } from './passengerInvite/passengerInvite.module';
import { RidderInviteModule } from './ridderInvite/ridderInvite.module';
import { HistoryModule } from './history/history.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PassengerAuthModule } from './passengerAuth/passengerAuth.module';
import { RidderAuthModule } from './ridderAuth/ridderAuth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import "dotenv/config";
import { join } from 'path';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { CronModule } from '../api/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST, 
        port: Number(process.env.MAILER_PORT), // enable encryption
        secure: true, // since we use port 465
        auth: {
          user: process.env.GOOGLE_GMAIL, 
          pass: process.env.GOOGLE_APPLICATION_PASSWORD, 
        }, 
      }, 
      template: {
        dir: join(__dirname, 'emailTemplates'), 
        adapter: new HandlebarsAdapter()
      }
    }), 
    DrizzleModule, 
    AuthModule,
    PassengerModule,
    PurchaseOrderModule,
    RidderModule,
    SupplyOrderModule,
    OrderModule,
    PassengerInviteModule,
    RidderInviteModule,
    HistoryModule,
    SupabaseModule,
    PassengerAuthModule,
    RidderAuthModule,
    EmailModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
