import * as bcrypt from 'bcrypt'
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../../src/drizzle/drizzle.module';
import { DrizzleDB } from '../../src/drizzle/types/drizzle';

import { RidderTable } from '../../src/drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../../src/drizzle/schema/ridderInfo.schema';

import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';

@Injectable()
export class RidderService {
  constructor(
    private config: ConfigService,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  /* ================================= Get operations ================================= */
  private async getRidderById(id: string) {
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
            phoneNumber: true,
            selfIntroduction: true,
            avatorUrl: true,
            motocycleType: true,
            motocyclePhotoUrl: true,
            createdAt: true,
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
            selfIntroduction: true,
            avatorUrl: true,
            motocycleLicense: true,
            motocycleType: true,
            motocyclePhotoUrl: true,
            createdAt: true,
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
                // tolerableRDV: true,  // maybe we'll need this on the passenger side
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
  async searchRiddersByUserName(
    userName: string,
    limit: number,
    offset: number,
  ) {
    return await this.db.query.RidderTable.findMany({
      where: like(RidderTable.userName, userName + "%"), // using entire prefix matching to search relative users
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            avatorUrl: true,
            motocycleType: true,
          }
        }
      },
      limit: limit,
      offset: offset,
    });
  }

  async searchPaginationRidders(limit: number, offset: number) {
    return await this.db.query.RidderTable.findMany({
      columns: {
        userName: true,
        email: true,
      },
      with: {
        info: {
          columns: {
            avatorUrl: true,
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
    const user = await this.getRidderById(id);
    if (!user) {
      throw new NotFoundException(`Cannot find the ridder with the given id`);
    }

    if (updateRidderDto.userName && updateRidderDto.userName.length !== 0) {  // if the user want to update its userName
      const unMatches = updateRidderDto.userName === user.userName;  // check if the userName matches the previous one
      if (unMatches) {
        throw new ConflictException(`Duplicated userName ${updateRidderDto.userName} detected, please use a different userName`);
      }
    }
    if (updateRidderDto.email && updateRidderDto.email.length !== 0) {  // if the user want to update its email
      const emMatches = updateRidderDto.email === user.email;  // check of the email matches the previous one
      if (emMatches) {
        throw new ConflictException(`Duplicated email ${updateRidderDto.email} detected, please use a different email`);
      }
    }
    if (updateRidderDto.password && updateRidderDto.password.length !== 0) {  // if the user want to update its password
      const pwMatches = await bcrypt.compare(updateRidderDto.password, user.hash); // check if the password matches the previous one
      if (pwMatches) {
        throw new ConflictException(`Duplicated credential detected, please use a different password`);
      }

      const hash = await bcrypt.hash(updateRidderDto.password, Number(this.config.get("SALT_OR_ROUND")));
      return await this.db.update(RidderTable).set({
        userName: updateRidderDto.userName,
        email: updateRidderDto.email,
        password: hash,
      }).where(eq(RidderTable.id, id))
        .returning({
          userName: RidderTable.userName,
          eamil: RidderTable.email,
      });
    }

    return await this.db.update(RidderTable).set({
      userName: updateRidderDto.userName,
      email: updateRidderDto.email,
    }).where(eq(RidderTable.id, id))
      .returning({
        userName: RidderTable.userName,
        eamil: RidderTable.email,
    });
  }

  async updateRidderInfoByUserId(
    userId: string, 
    updateRidderInfoDto: UpdateRidderInfoDto,
  ) {
    return await this.db.update(RidderInfoTable).set({
      isOnline: updateRidderInfoDto.isOnline,
      age: updateRidderInfoDto.age,
      phoneNumber: updateRidderInfoDto.phoneNumber,
      selfIntroduction: updateRidderInfoDto.selfIntroduction,
      motocycleLicense: updateRidderInfoDto.motocycleLicense,
      motocyclePhotoUrl: updateRidderInfoDto.motocylePhotoUrl,
      motocycleType: updateRidderInfoDto.motocycleType,
      avatorUrl: updateRidderInfoDto.avatorUrl,
    }).where(eq(RidderInfoTable.userId, userId));
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  async deleteRiddderById(id: string) {
    return await this.db.delete(RidderTable)
      .where(eq(RidderTable.id, id))
      .returning({
        id: RidderTable.id,
        userName: RidderTable.userName,
        email: RidderTable.email,
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