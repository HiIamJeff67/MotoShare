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

@Module({
  imports: [
    DrizzleModule, 
    AuthModule,
    PassengerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PurchaseOrderModule,
    RidderModule,
    SupplyOrderModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
