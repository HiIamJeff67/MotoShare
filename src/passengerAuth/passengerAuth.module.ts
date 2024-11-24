import { Module } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { PassengerAuthController } from './passengerAuth.controller';

@Module({
  controllers: [PassengerAuthController],
  providers: [PassengerAuthService],
})
export class PassengerAuthModule {}
