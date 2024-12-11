import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [CronController],
  providers: [CronService],
  imports: [DrizzleModule, NotificationModule]
})
export class CronModule {}
