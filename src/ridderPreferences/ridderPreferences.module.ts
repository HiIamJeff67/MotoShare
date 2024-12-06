import { Module } from '@nestjs/common';
import { RidderPreferencesService } from './ridderPreferences.service';
import { RidderPreferencesController } from './ridderPreferences.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [RidderPreferencesController], 
  providers: [RidderPreferencesService], 
  imports: [DrizzleModule], 
})
export class RidderPreferencesModule {}
