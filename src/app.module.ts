import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { PassengerModule } from './passenger/passenger.module';
import { ConfigModule } from '@nestjs/config';
import { PassengerInfoModule } from './passengerInfo/passengerInfo.module';
import { PurchaseOrderModule } from './purchaseOrder/purchaseOrder.module';

@Module({
  imports: [
    DrizzleModule, 
    PassengerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassengerInfoModule,
    PurchaseOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
