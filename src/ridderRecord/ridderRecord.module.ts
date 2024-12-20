import { Module } from '@nestjs/common';
import { RidderRecordService } from './ridderRecord.service';
import { RidderRecordController } from './ridderRecord.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [RidderRecordController],
  providers: [RidderRecordService],
  imports: [DrizzleModule], 
})
export class RidderRecordModule {}
