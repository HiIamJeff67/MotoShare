import { Inject, Injectable } from '@nestjs/common';
import { CreateRidderBankDto } from './dto/create-ridderBank.dto';
import { UpdateRidderBankDto } from './dto/update-ridderBank.dto';
import { STRIPE_CLIENT } from '../stripe/constants';
import Stripe from 'stripe';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';

@Injectable()
export class RidderBankService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}
}
