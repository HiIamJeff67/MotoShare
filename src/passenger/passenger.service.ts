import * as bcrypt from 'bcrypt';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle'

import { PassengerTable } from '../../src/drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';

import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ClientNoChangeOnEmailException, ClientNoChangeOnPasswordException, ClientNoChangeOnUserNameException, ClientPassengerNotFoundException } from '../exceptions';

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

  // once a ridder want to find a passenger, he/she first do a search
  // then specify a passenger with his/her userName,
  // finally use this userName to get the info of that passenger
  // for specifying the details of the passenger(who is not the current user)
  async getPassengerWithInfoByUserName(userName: string) {
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.userName, userName),
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            isOnline: true,
            age: true,
            // phoneNumber: true,
            selfIntroduction: true,
            avatorUrl: true,
            createdAt: true,
          }
        },
      }
    });
  }

  async getPassengerWithInfoByUserId(userId: string) {
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.id, userId),
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            isOnline: true,
            age: true,
            phoneNumber: true,
            selfIntroduction: true,
            avatorUrl: true,
            createdAt: true,
          }
        },
      }
    });
  }
  
  async getPassengerWithCollectionByUserId(userId: string) {
    return await this.db.query.PassengerTable.findFirst({
      where: eq(PassengerTable.id, userId),
      columns: {
        userName: true,
      },
      with: {
        collection: {
          with: {
            order: {
              columns: {
                id: true,
                description: true,
                initPrice: true,
                startCord: true,
                endCord: true,
                createdAt: true,
                updatedAt: true,
                startAfter: true,
                tolerableRDV: true,
                status: true,
              },
              with: {
                creator: {
                  columns: {
                    userName: true,
                  }
                }
              }
            }
          }
        },
      }
    });
  }

  /* ================= Search operations ================= */
  async searchPaginationPassengers(
    userName: string | undefined = undefined,
    limit: number, 
    offset: number,
  ) {
    return await this.db.query.PassengerTable.findMany({
      ...(userName && {where: like(PassengerTable.userName, userName + "%")}), // using entire prefix matching to search relative users
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            avatorUrl: true,
            isOnline: true,
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
      throw ClientPassengerNotFoundException;
    }

    if (updatePassengerDto.userName && updatePassengerDto.userName.length !== 0) {  // if the user want to update its userName
      const unMatches = updatePassengerDto.userName === user.userName;  // check if the userName matches the previous one
      if (unMatches) throw ClientNoChangeOnUserNameException;
    }
    if (updatePassengerDto.email && updatePassengerDto.email.length !== 0) {  // if the user want to update its email
      const emMatches = updatePassengerDto.email === user.email;  // check of the email matches the previous one
      if (emMatches) throw ClientNoChangeOnEmailException;
    }
    if (updatePassengerDto.password && updatePassengerDto.password.length !== 0) {  // if the user want to update its password
      const pwMatches = await bcrypt.compare(updatePassengerDto.password, user.hash); // check if the password matches the previous one
      if (pwMatches) throw ClientNoChangeOnPasswordException;

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

    return await this.db.update(PassengerTable).set({
      userName: updatePassengerDto.userName,
      email: updatePassengerDto.email,
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
    }).where(eq(PassengerInfoTable.userId, userId));
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
        email: PassengerTable.email,
      });
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Test operations ================================= */
  async getAllPassengers() {
    return await this.db.select({
      id: PassengerTable.id,
      userName: PassengerTable.userName,
    }).from(PassengerTable);
  }
  /* ================================= Test operations ================================= */
}
