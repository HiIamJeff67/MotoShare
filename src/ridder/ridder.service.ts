import * as bcrypt from 'bcrypt'
import { Inject, Injectable } from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';

import { RidderTable } from '../../src/drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../../src/drizzle/schema/ridderInfo.schema';

import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { 
  ClientDeleteAccountPasswordNotMatchException, 
  ClientNoChangeOnUserNameException, 
  ClientRidderAuthNotFoundException, 
  ClientRidderNotFoundException 
} from '../exceptions';
import { SupabaseStorageService } from '../supabaseStorage/supabaseStorage.service';
import { DeleteRidderDto } from './dto/delete-ridder.dto';
import { UserRoleType } from '../types';
import { PassengerInfoTable } from '../drizzle/schema/passengerInfo.schema';
import { RidderAuthTable } from '../drizzle/schema/ridderAuth.schema';

@Injectable()
export class RidderService {
  constructor(
    private storage: SupabaseStorageService,
    private config: ConfigService,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  /* ================================= Get operations ================================= */
  private async _getRidderById(id: string) {
    const response =  await this.db.select({
      id: RidderTable.id,
      userName: RidderTable.userName,
      email: RidderTable.email,
      hash: RidderTable.password,
    }).from(RidderTable)
      .where(eq(RidderTable.id, id))
      .limit(1);
  
    return response && response.length > 0 ? response[0] : undefined;
  }

  // for specifying the details of the ridder(who is not the current user)
  async getRidderWithInfoByUserName(userName: string) {
    return await this.db.query.RidderTable.findFirst({
      where: eq(RidderTable.userName, userName),
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
            motocycleType: true,
            motocyclePhotoUrl: true,
            createdAt: true, 
            updatedAt: true,
          }
        },
      }
    });
  }

  async getRidderWithInfoByPhoneNumber(phoneNumber: string) {
    return await this.db.query.RidderInfoTable.findFirst({
      where: eq(RidderInfoTable.phoneNumber, phoneNumber),
      columns: {
        isOnline: true,
        age: true,
        // phoneNumber: true,
        selfIntroduction: true,
        avatorUrl: true,
        motocycleLicense: true,
        motocycleType: true,
        motocyclePhotoUrl: true,
        createdAt: true, 
        updatedAt: true,
      },
      with: {
        user: {
          columns: {
            userName: true, 
            email: true, 
          }
        },
      }
    });
  }

  async getRidderWithInfoByUserId(userId: string) {
    return await this.db.query.RidderTable.findFirst({
      where: eq(RidderTable.id, userId),
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
            emergencyUserRole: true,
            emergencyPhoneNumber: true, 
            selfIntroduction: true,
            avatorUrl: true,
            motocycleLicense: true,
            motocycleType: true,
            motocyclePhotoUrl: true,
            createdAt: true, 
            updatedAt: true,
          }
        },
      }
    });
  }

  async getRidderWithCollectionByUserId(userId: string) {
    return await this.db.query.RidderTable.findFirst({
      where: eq(RidderTable.id, userId),
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
                isUrgent: true,
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
  async searchPaginationRidders(
    userName: string | undefined = undefined,
    limit: number, 
    offset: number,
  ) {
    return await this.db.query.RidderTable.findMany({
      ...(userName && {where: like(RidderTable.userName, userName + "%")}),
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            avatorUrl: true,
            isOnline: true,
            motocycleType: true,
          }
        }
      },
      orderBy: RidderTable.userName,
      limit: limit,
      offset: offset,
    });
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updateRidderById(
    id: string, 
    updateRidderDto: UpdateRidderDto,
  ) {
    // check if the new password is same as the previous one
    const user = await this._getRidderById(id);
    if (!user) {
      throw ClientRidderNotFoundException;
    }

    if (updateRidderDto.userName && updateRidderDto.userName.length !== 0) {  // if the user want to update its userName
      const unMatches = updateRidderDto.userName === user.userName;  // check if the userName matches the previous one
      if (unMatches) throw ClientNoChangeOnUserNameException;
    }

    return await this.db.update(RidderTable).set({
      userName: updateRidderDto.userName,
    }).where(eq(RidderTable.id, id))
      .returning({
        userName: RidderTable.userName,
        eamil: RidderTable.email,
    });
  }

  async updateRidderInfoByUserId(
    userId: string, 
    updateRidderInfoDto: UpdateRidderInfoDto,
    uploadedAvatorFile: Express.Multer.File | undefined = undefined,
    uploadedMotocyclePhotoFile: Express.Multer.File | undefined = undefined, 
  ) {
    return await this.db.transaction(async (tx) => {
      const ridderInfo = await tx.select({
        infoId: RidderInfoTable.id,
      }).from(RidderInfoTable)
        .where(eq(RidderInfoTable.userId, userId));
      if (!ridderInfo || ridderInfo.length === 0) throw ClientRidderNotFoundException;

      let emergencyUserRole: UserRoleType | undefined = undefined;
      if (updateRidderInfoDto.emergencyPhoneNumber) {
        emergencyUserRole = "Guest";

        const passenger = await tx.select({
          id: PassengerInfoTable.id, 
        }).from(PassengerInfoTable)
          .where(eq(PassengerInfoTable.emergencyPhoneNumber, updateRidderInfoDto.emergencyPhoneNumber));
        
        if (passenger && passenger.length !== 0) {
          emergencyUserRole = "Passenger";
        } else {
          const ridder = await tx.select({
            id: RidderInfoTable.id, 
          }).from(RidderInfoTable)
            .where(eq(RidderInfoTable.emergencyPhoneNumber, updateRidderInfoDto.emergencyPhoneNumber));
          
          if (ridder && ridder.length !== 0) {
            emergencyUserRole = "Ridder";
          }
        }
      }

      // if the user also want to update his/her phoneNumber, 
      // we should make sure his/her previous phone authentication is set to default
      if (updateRidderInfoDto.phoneNumber && updateRidderInfoDto.phoneNumber.length !== 0) {
        const responseOfUpdatingRidderAuth = await tx.update(RidderAuthTable).set({
          isPhoneAuthenticated: false, 
        }).where(eq(RidderAuthTable.userId, userId))
          .returning();
        if (!responseOfUpdatingRidderAuth || responseOfUpdatingRidderAuth.length === 0) {
          throw ClientRidderAuthNotFoundException;
        }
      }
  
      return await tx.update(RidderInfoTable).set({
        isOnline: updateRidderInfoDto.isOnline,
        age: updateRidderInfoDto.age,
        phoneNumber: updateRidderInfoDto.phoneNumber,
        ...(emergencyUserRole !== undefined && { emergencyUserRole: emergencyUserRole }), 
        emergencyPhoneNumber: updateRidderInfoDto.emergencyPhoneNumber, 
        selfIntroduction: updateRidderInfoDto.selfIntroduction,
        motocycleLicense: updateRidderInfoDto.motocycleLicense,
        motocycleType: updateRidderInfoDto.motocycleType,
        ...(uploadedAvatorFile 
          ? { avatorUrl: await this.storage.uploadAvatorFile(
                ridderInfo[0].infoId, 
                "ridderAvators", 
                uploadedAvatorFile
              ) 
            } 
          : {}
        ), 
        ...(uploadedMotocyclePhotoFile
          ? { motocyclePhotoUrl: await this.storage.uploadMotocyclePhotoFile(
                ridderInfo[0].infoId, 
                "ridderMotocyclePhotos", 
                uploadedMotocyclePhotoFile
              )
            }
          : {}
        ), 
        updatedAt: new Date(), 
      }).where(eq(RidderInfoTable.userId, userId))
        .returning({
          isOnline: RidderInfoTable.isOnline, 
          age: RidderInfoTable.age, 
          phoneNumber: RidderInfoTable.phoneNumber, 
          emergencyPhoneNumber: RidderInfoTable.emergencyPhoneNumber, 
          emergencyUserRole: RidderInfoTable.emergencyUserRole, 
          selfIntroduction: RidderInfoTable.selfIntroduction, 
          motocycleLicense: RidderInfoTable.motocycleLicense, 
          motocycleType: RidderInfoTable.motocycleType, 
          avatorUrl: RidderInfoTable.avatorUrl, 
          motocyclePhotoUrl: RidderInfoTable.motocyclePhotoUrl, 
        });
    });
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteRiddderById(id: string, deleteRidderDto: DeleteRidderDto) {
    return await this.db.transaction(async (tx) => {
      const responseOfSelectingRidder = await tx.select({
        hash: RidderTable.password, 
      }).from(RidderTable)
        .where(eq(RidderTable.id, id));
      if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
        throw ClientRidderNotFoundException;
      }

      const pwMatches = await bcrypt.compare(deleteRidderDto.password, responseOfSelectingRidder[0].hash);
      if (!pwMatches) throw ClientDeleteAccountPasswordNotMatchException;

      return await tx.delete(RidderTable)
        .where(eq(RidderTable.id, id))
        .returning({
          id: RidderTable.id,
          userName: RidderTable.userName,
          email: RidderTable.email,
      });
    });
  }
  /* ================================= Delete operations ================================= */

  
  /* ================================= Test operations ================================= */
  async testBcryptHashing(secretText: string, hash: string | undefined) {
    if (!hash) {
      hash = await bcrypt.hash(secretText, Number(this.config.get("SALT_OR_ROUND")));
    }
    const isMatch = await bcrypt.compare(secretText, hash);
    return {
      originalData: secretText,
      hashData: hash,
      isMatch: isMatch,
    }
  }

  async getAllRidders() {
    return await this.db.select({
      id: RidderTable.id,
      userName: RidderTable.userName,
    }).from(RidderTable);
  }
  /* ================================= Test operations ================================= */
}