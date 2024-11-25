import { Module } from '@nestjs/common';
import { RidderAuthService } from './ridderAuth.service';
import { RidderAuthController } from './ridderAuth.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [RidderAuthController], 
  providers: [RidderAuthService], 
  imports: [DrizzleModule, EmailModule], 
})
export class RidderAuthModule {}
