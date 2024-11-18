import { Module } from '@nestjs/common';
import { RidderService } from './ridder.service';
import { RidderController } from './ridder.controller';
import { DrizzleModule } from '../../src/drizzle/drizzle.module';
import { SupabaseStorageModule } from '../supabaseStorage/supabaseStorage.module';

@Module({
  controllers: [RidderController],
  providers: [RidderService],
  imports: [DrizzleModule, SupabaseStorageModule],
})
export class RidderModule {}
