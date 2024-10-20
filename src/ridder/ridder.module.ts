import { Module } from '@nestjs/common';
import { RidderService } from './ridder.service';
import { RidderController } from './ridder.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [RidderController],
  providers: [RidderService],
  imports: [DrizzleModule],
})
export class RidderModule {}
