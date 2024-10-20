import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { PassengerModule } from './passenger/passenger.module';
import { ConfigModule } from '@nestjs/config';
import { PurchaseOrderModule } from './purchaseOrder/purchaseOrder.module';
import { RidderModule } from './ridder/ridder.module';
import { SupplyOrderModule } from './supplyOrder/supplyOrder.module';

@Module({
  imports: [
    DrizzleModule, 
    PassengerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PurchaseOrderModule,
    RidderModule,
    SupplyOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
