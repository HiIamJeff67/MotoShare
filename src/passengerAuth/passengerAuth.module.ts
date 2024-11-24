import { Module } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { PassengerAuthController } from './passengerAuth.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [PassengerAuthController], 
  providers: [PassengerAuthService], 
  imports: [DrizzleModule], 
})
export class PassengerAuthModule {}
