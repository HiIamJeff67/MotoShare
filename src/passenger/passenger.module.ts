import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService],
  imports: [DrizzleModule, AuthModule],
})
export class PassengerModule {}
