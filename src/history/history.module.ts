import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [DrizzleModule],
})
export class HistoryModule {}
