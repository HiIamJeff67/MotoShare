import * as bcrypt from 'bcrypt';
import { ConflictException, Inject, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle'
import { UpdatePassengerInfoDto } from './dto/update-info.dto';

import { PassengerTable } from 'src/drizzle/schema/passenger.schema';
import { PassengerInfoTable } from 'src/drizzle/schema/passengerInfo.schema';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    private config: ConfigService,
    @Inject(DRIZZLE) private db: DrizzleDB
  ) {}
  /* ================================= Get operations ================================= */
  private async getPassengerById(id: string) {
    const response = await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
      email: PassengerTable.email,
      hash: PassengerTable.password,
    }).from(PassengerTable)
      .where(eq(PassengerTable.id, id))
      .limit(1);
    
    return response && response.length > 0 ? response[0] : undefined;
  }

  async getPassengerWithInfoByUserId(userId: string) {
    // should specify the interface of response here
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.id, userId),
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: true,
      }
    });
  }
  
  async getPassengerWithCollectionByUserId(userId: string) {
    // should specify the interface of response here
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.id, userId),
      columns: {
        userName: true,
      },
      with: {
        collection: true,
      }
    });
  }

  /* ================= Search operations ================= */
  // usually used by ridder(to search the passengers)
  async searchPassengersByUserName(userName: string, limit: number, offset: number) {
    return await this.db.query.PassengerTable.findMany({
      where: like(PassengerTable.userName, userName + "%"), // using entire prefix matching to search relative users
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            selfIntroduction: true,
            avatorUrl: true,
          }
        }
      },
      limit: limit,
      offset: offset,
    });
  }

  async getPaginationPassengers(limit: number, offset: number) {
    return await this.db.query.PassengerTable.findMany({
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            selfIntroduction: true,
            avatorUrl: true,
          }
        }
      },
      orderBy: PassengerTable.userName,
      limit: limit,
      offset: offset,
    });
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updatePassengerById(
    id: string, 
    updatePassengerDto: UpdatePassengerDto,
  ) {
    // check if the new password is same as the previous one
    const user = await this.getPassengerById(id);
    if (!user) {
      throw new NotFoundException(`Cannot find the passenger with given id`);
    }

    if (updatePassengerDto.userName && updatePassengerDto.userName.length !== 0) {  // if the user want to update its userName
      const unMatches = updatePassengerDto.userName === user.userName;  // check if the userName matches the previous one
      if (unMatches) {
        throw new ConflictException(`Duplicated userName ${updatePassengerDto.userName} detected, please use a different userName`);
      }
    }
    if (updatePassengerDto.email && updatePassengerDto.email.length !== 0) {  // if the user want to update its email
      const emMatches = updatePassengerDto.email === user.email;  // check of the email matches the previous one
      if (emMatches) {
        throw new ConflictException(`Duplicated email ${updatePassengerDto.email} detected, please use a different email`);
      }
    }
    if (updatePassengerDto.password && updatePassengerDto.password.length !== 0) {  // if the user want to update its password
      const pwMatches = await bcrypt.compare(updatePassengerDto.password, user.hash); // check if the password matches the previous one
      if (pwMatches) {
        throw new ConflictException(`Duplicated credential detected, please use a different password`);
      }
    }

    const hash = await bcrypt.hash(updatePassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));

    return await this.db.update(PassengerTable).set({
      userName: updatePassengerDto.userName,
      email: updatePassengerDto.email,
      password: hash,
    }).where(eq(PassengerTable.id, id))
      .returning({
        userName: PassengerTable.userName,
        eamil: PassengerTable.email,
    });
  }

  async updatePassengerInfoByUserId(
    userId: string, 
    updatePassengerInfoDto: UpdatePassengerInfoDto,
  ) {
    return await this.db.update(PassengerInfoTable).set({
      isOnline: updatePassengerInfoDto.isOnline,
      age: updatePassengerInfoDto.age,
      phoneNumber: updatePassengerInfoDto.phoneNumber,
      selfIntroduction: updatePassengerInfoDto.selfIntroduction,
      avatorUrl: updatePassengerInfoDto.avatorUrl,
    }).where(eq(PassengerInfoTable.userId, userId))
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePassengerById(id: string) {
    return await this.db.delete(PassengerTable)
      .where(eq(PassengerTable.id, id))
      .returning({
        id: PassengerTable.id,
        userName: PassengerTable.userName,
        email: PassengerTable.email
      });
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Other operations ================================= */
  async getAllPassengers() {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
    }).from(PassengerTable);
  }
  /* ================================= Other operations ================================= */
}
