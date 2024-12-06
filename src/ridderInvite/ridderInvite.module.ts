import { Module } from '@nestjs/common';
import { RidderInviteService } from './ridderInvite.service';
import { RidderInviteController } from './ridderInvite.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [RidderInviteController],
  providers: [RidderInviteService],
  imports: [DrizzleModule, NotificationModule],
})
export class RidderInviteModule {}
