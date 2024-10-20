import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle'
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

import { PassengerTable } from 'src/drizzle/schema/passenger.schema';
import { PassengerInfoTable } from 'src/drizzle/schema/passengerInfo.schema';
import { PassengerCollectionTable } from 'src/drizzle/schema/passengerCollection.schema';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';

@Injectable()
export class PassengerService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createPassenger(createPassengerDto: CreatePassengerDto) {
    return await this.db.insert(PassengerTable).values({
      userName: createPassengerDto.userName,
      email: createPassengerDto.email,
      password: createPassengerDto.password,
    }).returning({
      id: PassengerTable.id,
    });
  }

  async createPassengerInfoByUserId(userId: string) {
    return await this.db.insert(PassengerInfoTable).values({
      userId: userId
    }).returning({
      id: PassengerInfoTable.id,
      userId: PassengerInfoTable.userId,
    });
  }

  async createPassengerCollectionByUserId(userId: string) {
    return await this.db.insert(PassengerCollectionTable).values({
      userId: userId
    }).returning({
      id: PassengerCollectionTable.id,
      userId: PassengerCollectionTable.userId,
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  async getPassengerById(id: string) {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
      email: PassengerTable.email,
    }).from(PassengerTable)
      .where(eq(PassengerTable.id, id));
  }

  async getPassengerWithInfoByUserId(userId: string) {
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.id, userId),
      with: {
        info: true,
      }
    });
  }
  
  async getPassengerWithCollectionByUserId(userId: string) {
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.id, userId),
      with: {
        collection: true,
      }
    });
  }

  async getAllPassengers() {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
    }).from(PassengerTable);
  }

  async getPaginationPassengers(limit: number, offset: number) {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
    }).from(PassengerTable)
      .limit(limit)
      .offset(offset);
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updatePassengerById(
    id: string, 
    updatePassengerDto: UpdatePassengerDto,
  ) {
    return await this.db.update(PassengerTable).set({
      userName: updatePassengerDto.userName,
      email: updatePassengerDto.email,
      password: updatePassengerDto.password,
    }).where(eq(PassengerTable.id, id))
      .returning({
        id: PassengerTable.id,
    });
  }

  async updatePassengerInfoByUserId(
    userId: string, 
    updatePassengerInfoDto: UpdatePassengerInfoDto,
  ) {
    return await this.db.update(PassengerInfoTable).set({
      isOnline: updatePassengerInfoDto.isOnline ?? false,
      age: updatePassengerInfoDto.age ?? undefined,
      phoneNumber: updatePassengerInfoDto.phoneNumber ?? undefined,
      selfIntroduction: updatePassengerInfoDto.selfIntroduction ?? undefined,
      avatorUrl: updatePassengerInfoDto.avatorUrl ?? undefined,
    }).where(eq(PassengerInfoTable.userId, userId))
      .returning({
        id: PassengerInfoTable.id,
      });
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePassengerById(id: string) { // maybe require a password to validate user operation
    return await this.db.delete(PassengerTable)
      .where(eq(PassengerTable.id, id))
  }
  /* ================================= Delete operations ================================= */
}
