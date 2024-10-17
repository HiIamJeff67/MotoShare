import { Module } from '@nestjs/common';
import { PassengerInfoService } from './passengerInfo.service';
import { PassengerInfoController } from './passengerInfo.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [PassengerInfoController],
  providers: [PassengerInfoService],
  imports: [DrizzleModule],
})
export class PassengerInfoModule {}
