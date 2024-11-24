import { Inject, Injectable } from '@nestjs/common';
import { CreatePassengerAuthDto } from './dto/create-passengerAuth.dto';
import { UpdatePassengerAuthDto } from './dto/update-passengerAuth.dto';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';

@Injectable()
export class PassengerAuthService {
	constructor(
		private config: ConfigService, 
		@Inject(DRIZZLE) private db: DrizzleDB, 
	) {}
	
	// async 
}
