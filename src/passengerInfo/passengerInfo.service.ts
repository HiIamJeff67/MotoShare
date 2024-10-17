import { Inject, Injectable } from '@nestjs/common';
import { CreatePassengerInfoDto } from './dto/create-passengerInfo.dto';
import { UpdatePassengerInfoDto } from './dto/update-passengerInfo.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';

import { PassengerInfoTable } from 'src/drizzle/schema/passengerInfo.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PassengerInfoService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  
  async createPassengerInfo(createPassengerInfoDto: CreatePassengerInfoDto) {
    return await this.db.insert(PassengerInfoTable).values({
      userId: createPassengerInfoDto.userId,
      isOnline: createPassengerInfoDto.isOnline ?? false,
      age: createPassengerInfoDto.age ?? undefined,
      phoneNumber: createPassengerInfoDto.phoneNumber ?? undefined,
      selfIntroduction: createPassengerInfoDto.selfIntroduction ?? undefined,
      avatorUrl: createPassengerInfoDto.avatorUrl ?? undefined,
    }).returning({
        id: PassengerInfoTable.id,
        userId: PassengerInfoTable.userId,
    });
  }

  findAll() {
    return `This action returns all passengerInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passengerInfo`;
  }

  async updatePassengerInfoById(infoId: string, updatePassengerInfoDto: UpdatePassengerInfoDto) {
    return await this.db.update(PassengerInfoTable).set({
      isOnline: updatePassengerInfoDto.isOnline ?? false,
      age: updatePassengerInfoDto.age ?? undefined,
      phoneNumber: updatePassengerInfoDto.phoneNumber ?? undefined,
      selfIntroduction: updatePassengerInfoDto.selfIntroduction ?? undefined,
      avatorUrl: updatePassengerInfoDto.avatorUrl ?? undefined,
    }).where(eq(PassengerInfoTable.id, infoId)).returning({
      id: PassengerInfoTable.id,
      userId: PassengerInfoTable.userId,
    });
  }

  async updatePassengerInfoByUserId(userId: string, updatePassengerInfoDto: UpdatePassengerInfoDto) {
    return await this.db.update(PassengerInfoTable).set({
      isOnline: updatePassengerInfoDto.isOnline ?? false,
      age: updatePassengerInfoDto.age ?? undefined,
      phoneNumber: updatePassengerInfoDto.phoneNumber ?? undefined,
      selfIntroduction: updatePassengerInfoDto.selfIntroduction ?? undefined,
      avatorUrl: updatePassengerInfoDto.avatorUrl ?? undefined,
    }).where(eq(PassengerInfoTable.userId, userId)).returning({
      id: PassengerInfoTable.id,
      userId: PassengerInfoTable.userId,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} passengerInfo`;
  }
}
