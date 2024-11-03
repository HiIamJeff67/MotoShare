import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { DrizzleModule } from '../../src/drizzle/drizzle.module';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService],
  imports: [DrizzleModule],
})
export class PassengerModule {}
