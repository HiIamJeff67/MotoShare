import { Module } from '@nestjs/common';
import { PassengerInviteService } from './passengerInvite.service';
import { PassengerInviteController } from './passengerInvite.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [PassengerInviteController],
  providers: [PassengerInviteService],
  imports: [DrizzleModule],
})
export class PassengerInviteModule {}
