import { Module } from '@nestjs/common';
import { RidderInviteService } from './ridderInvite.service';
import { RidderInviteController } from './ridderInvite.controller';

@Module({
  controllers: [RidderInviteController],
  providers: [RidderInviteService],
})
export class RidderInviteModule {}
