import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { DrizzleModule } from '../../src/drizzle/drizzle.module';
import { SupabaseStorageModule } from '../supabaseStorage/supabaseStorage.module';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService],
  imports: [DrizzleModule, SupabaseStorageModule],
})
export class PassengerModule {}
