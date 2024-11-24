import { Module } from '@nestjs/common';
import { RidderAuthService } from './ridderAuth.service';
import { RidderAuthController } from './ridderAuth.controller';

@Module({
  controllers: [RidderAuthController],
  providers: [RidderAuthService],
})
export class RidderAuthModule {}
