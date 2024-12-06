import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [DrizzleModule, NotificationModule],
})
export class HistoryModule {}
