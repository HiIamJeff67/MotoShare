import { Module } from '@nestjs/common';
import { RidderInviteService } from './ridderInvite.service';
import { RidderInviteController } from './ridderInvite.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [RidderInviteController],
  providers: [RidderInviteService],
  imports: [DrizzleModule],
})
export class RidderInviteModule {}
