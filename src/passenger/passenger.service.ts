import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle'
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

import { PassengerTable } from 'src/drizzle/schema/passenger.schema';

@Injectable()
export class PassengerService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async createPassenger(createPassengerDto: CreatePassengerDto) {
    return await this.db.insert(PassengerTable)
      .values({
        userName: createPassengerDto.userName,
        email: createPassengerDto.email,
        password: createPassengerDto.password,
    }).returning({
        id: PassengerTable.id
    });
  }

  async getPassengerById(id: string) {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
      email: PassengerTable.email,
    }).from(PassengerTable)
      .where(eq(PassengerTable.id, id))
  }

  async getAllPassengers() {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
    }).from(PassengerTable);
  }

  async getPaginationPassengerIdAndName(limit: number, offset: number) {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
    }).from(PassengerTable)
      .limit(limit)
      .offset(offset);
  }

  async updatePassengerById(id: string, updatePassengerDto: UpdatePassengerDto) {
    return await this.db.update(PassengerTable).set({
        userName: updatePassengerDto.userName,
        email: updatePassengerDto.email,
        password: updatePassengerDto.password,
    }).where(eq(PassengerTable.id, id)).returning({
      id: PassengerTable.id,
    });
  }

  async deletePassengerById(id: string) { // maybe require a password to validate user operation
    return await this.db.delete(PassengerTable)
      .where(eq(PassengerTable.id, id))
  }
}
