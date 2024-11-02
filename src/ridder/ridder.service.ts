import * as bcrypt from 'bcrypt'
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { and, eq } from 'drizzle-orm';

import { RidderTable } from 'src/drizzle/schema/ridder.schema';
import { RidderInfoTable } from 'src/drizzle/schema/ridderInfo.schema';

import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';

@Injectable()
export class RidderService {
  constructor(
    private config: ConfigService,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  /* ================================= Create operations ================================= */
  async createRidder(createRidderDto: CreateRidderDto) {
    try {
      // hash the password, then provide hash value to create the user
      const hash = await bcrypt.hash(createRidderDto.password, Number(this.config.get("SALT_OR_ROUND")));

      const response = await this.db.insert(RidderTable).values({
        userName: createRidderDto.userName,
        email: createRidderDto.email,
        password: hash,
      }).returning({
        id: RidderTable.id,
        userName: RidderTable.userName, // useful for front end to show 'welcome someone!'
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async createRidderInfoByUserId(userId: string) {
    try {
      return await this.db.insert(RidderInfoTable).values({
        userId: userId
      }).returning({
        id: RidderInfoTable.id,
        userId: RidderInfoTable.userId,
      });
    } catch (error) {
      throw error;
    }
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  async getRidderById(id: string) {
    try {
      return await this.db.select({
        id: RidderTable.id,
        userName: RidderTable.userName,
        email: RidderTable.email,
      }).from(RidderTable)
        .where(eq(RidderTable.id, id))
        .limit(1);
    } catch (error) {
      throw error;
    }
  }

  async getRidderWithInfoByUserId(userId: string) {
    try {
      return await this.db.query.RidderTable.findFirst({
        where: eq(RidderTable.id, userId),
        with: {
          info: true,
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async getRidderWithCollectionByUserId(userId: string) {
    try {
      return await this.db.query.RidderTable.findFirst({
        where: eq(RidderTable.id, userId),
        with: {
          collection: true,
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllRidders() {
    try {
      return await this.db.select({
        id: RidderTable.id,
        userName: RidderTable.userName,
      }).from(RidderTable);
    } catch (error) {
      throw error;
    }
  }

  async getPaginationRidders(limit: number, offset: number) {
    try {
      return await this.db.select({
        id: RidderTable.id,
        userName: RidderTable.userName,
      }).from(RidderTable)
        .limit(limit)
        .offset(offset);
    } catch (error) {
      throw error;
    }
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updateRidderById(id: string, updateRidderDto: UpdateRidderDto) {
    try {
      return await this.db.update(RidderTable).set({
        userName: updateRidderDto.userName,
        email: updateRidderDto.email,
        password: updateRidderDto.password,
      }).where(eq(RidderTable.id, id))
        .returning({
          id: RidderTable.id,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRidderInfoByUserId(
    userId: string, 
    updateRidderInfoDto: UpdateRidderInfoDto,
  ) {
    try {
      return await this.db.update(RidderInfoTable).set({
        isOnline: updateRidderInfoDto.isOnline ?? false,
        age: updateRidderInfoDto.age ?? undefined,
        phoneNumber: updateRidderInfoDto.phoneNumber ?? undefined,
        selfIntroduction: updateRidderInfoDto.selfIntroduction ?? undefined,
        motocycleLicense: updateRidderInfoDto.motocycleLicense ?? undefined,
        motocyclePhotoUrl: updateRidderInfoDto.motocylePhotoUrl ?? undefined,
        avatorUrl: updateRidderInfoDto.avatorUrl ?? undefined,
      }).where(eq(RidderInfoTable.userId, userId))
        .returning({
          id: RidderInfoTable.id,
        });
    } catch (error) {
      throw error;
    }
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteRiddderById(id: string) {
    try {
      return await this.db.delete(RidderTable)
        .where(eq(RidderTable.id, id));
    } catch (error) {
      throw error;
    }
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
  /* ================================= Test operations ================================= */
}