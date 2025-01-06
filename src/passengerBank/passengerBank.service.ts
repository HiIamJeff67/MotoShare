import { Inject, Injectable } from '@nestjs/common';
import { CreatePassengerBankDto } from './dto/create-passengerBank.dto';
import { UpdatePassengerBankDto } from './dto/update-passengerBank.dto';
import { STRIPE_CLIENT } from '../stripe/constants';
import Stripe from 'stripe';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';

@Injectable()
export class PassengerBankService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  async listStripeCostomers() {
    return this.stripe.customers.list();
  }
}
