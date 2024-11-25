import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle'

import { PassengerTable } from '../../src/drizzle/schema/passenger.schema';
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';

import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ClientDeleteAccountPasswordNotMatchException, ClientNoChangeOnEmailException, ClientNoChangeOnPasswordException, ClientNoChangeOnUserNameException, ClientPassengerNotFoundException } from '../exceptions';
import { SupabaseStorageService } from '../supabaseStorage/supabaseStorage.service';
import { DeletePassengerDto } from './dto/delete-passenger.dto';

@Injectable()
export class PassengerService {
  constructor(
    private config: ConfigService,
    private storage: SupabaseStorageService,
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}
  
  /* ================================= Get operations ================================= */
  private async _getPassengerById(id: string) {
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
            updatedAt: true,
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
            updatedAt: true,
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
    const user = await this._getPassengerById(id);
    if (!user) {
      throw ClientPassengerNotFoundException;
    }

    if (updatePassengerDto.userName && updatePassengerDto.userName.length !== 0) {  // if the user want to update its userName
      const unMatches = updatePassengerDto.userName === user.userName;  // check if the userName matches the previous one
      if (unMatches) throw ClientNoChangeOnUserNameException;
    }

    return await this.db.update(PassengerTable).set({
      userName: updatePassengerDto.userName,
    }).where(eq(PassengerTable.id, id))
      .returning({
        userName: PassengerTable.userName,
        eamil: PassengerTable.email,
    });
  }

  async updatePassengerInfoByUserId(
    userId: string, 
    updatePassengerInfoDto: UpdatePassengerInfoDto,
    uploadedFile: Express.Multer.File | undefined = undefined,
  ) {
    return await this.db.transaction(async (tx) => {
      const passengerInfo = await tx.select({
        infoId: PassengerInfoTable.id,
      }).from(PassengerInfoTable)
        .where(eq(PassengerInfoTable.userId, userId));
      if (!passengerInfo || passengerInfo.length === 0) throw ClientPassengerNotFoundException;
  
      return await tx.update(PassengerInfoTable).set({
        isOnline: updatePassengerInfoDto.isOnline,
        age: updatePassengerInfoDto.age,
        phoneNumber: updatePassengerInfoDto.phoneNumber,
        selfIntroduction: updatePassengerInfoDto.selfIntroduction,
        ...(uploadedFile
          ? { avatorUrl: await this.storage.uploadFile(
                passengerInfo[0].infoId,
                "AvatorBucket",
                "passengerAvators/",
                uploadedFile
              ) 
            }
          : {}
        ),
        updatedAt: new Date(), 
      }).where(eq(PassengerInfoTable.userId, userId));
    });
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deletePassengerById(id: string, deletePassengerDto: DeletePassengerDto) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingPassenger = await tx.select({
        hash: PassengerTable.password, 
      }).from(PassengerTable)
        .where(eq(PassengerTable.id, id));
      if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
        throw ClientPassengerNotFoundException;
      }

      const pwMatches = await bcrypt.compare(deletePassengerDto.password, responseOfSelectingPassenger[0].hash);
      if (!pwMatches) throw ClientDeleteAccountPasswordNotMatchException;

      return await tx.delete(PassengerTable)
        .where(eq(PassengerTable.id, id))
        .returning({
          id: PassengerTable.id,
          userName: PassengerTable.userName,
          email: PassengerTable.email,
      });
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
