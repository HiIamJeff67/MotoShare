import { Module } from '@nestjs/common';
import { PassengerPreferencesService } from './passengerPreferences.service';
import { PassengerPreferencesController } from './passengerPreferences.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [PassengerPreferencesController], 
  providers: [PassengerPreferencesService], 
  imports: [DrizzleModule], 
})
export class PassengerPreferencesModule {}
