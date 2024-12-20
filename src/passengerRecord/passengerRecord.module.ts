import { Module } from '@nestjs/common';
import { PassengerRecordService } from './passengerRecord.service';
import { PassengerRecordController } from './passengerRecord.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [PassengerRecordController],
  providers: [PassengerRecordService],
  imports: [DrizzleModule], 
})
export class PassengerRecordModule {}
