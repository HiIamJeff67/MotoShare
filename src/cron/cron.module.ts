import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CronController],
  providers: [CronService],
  imports: [DrizzleModule, ConfigModule], 
})
export class CronModule {}
