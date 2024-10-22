import { Inject, Injectable } from '@nestjs/common';
import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { RidderTable } from 'src/drizzle/schema/ridder.schema';
import { and, eq } from 'drizzle-orm';
import { RidderInfoTable } from 'src/drizzle/schema/ridderInfo.schema';
import { RidderCollectionTable } from 'src/drizzle/schema/ridderCollection.schema';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { SignInRidderDto } from './dto/signIn-ridder.dto';

@Injectable()
export class RidderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createRidder(createRidderDto: CreateRidderDto) {
    return await this.db.insert(RidderTable).values({
      userName: createRidderDto.userName,
      email: createRidderDto.email,
      password: createRidderDto.password,
    }).returning({
      id: RidderTable.id,
    });
  }

  async createRidderInfoByUserId(userId: string) {
    return await this.db.insert(RidderInfoTable).values({
      userId: userId
    }).returning({
      id: RidderInfoTable.id,
      userId: RidderInfoTable.userId,
    });
  }

  async createRidderCollectionByUserId(userId: string) {
    return await this.db.insert(RidderCollectionTable).values({
      userId: userId,
    }).returning({
      id: RidderCollectionTable.id,
      userId: RidderCollectionTable.userId,
    });
  }
  /* ================================= Create operations ================================= */


  /* ================================= Auth validate operations ================================= */
  async signInRidderByEamilAndPassword(signInRidderDto: SignInRidderDto) {
    // since email is unique variable, there should be only one response
    return await this.db.select({
      id: RidderTable.id,
      userName: RidderTable.userName,
      email: RidderTable.email,
    }).from(RidderTable)
      .where(and(eq(RidderTable.email, signInRidderDto.email), eq(RidderTable.password, signInRidderDto.password)))
      .limit(1);
  }
  /* ================================= Auth validate operations ================================= */


  /* ================================= Get operations ================================= */
  async getRidderById(id: string) {
    return await this.db.select({
      id: RidderTable.id,
      userName: RidderTable.userName,
      email: RidderTable.email,
    }).from(RidderTable)
      .where(eq(RidderTable.id, id))
      .limit(1);
  }

  async getRidderWithInfoByUserId(userId: string) {
    return await this.db.query.RidderTable.findFirst({
      where: eq(RidderTable.id, userId),
      with: {
        info: true,
      }
    });
  }

  async getRidderWithCollectionByUserId(userId: string) {
    return await this.db.query.RidderTable.findFirst({
      where: eq(RidderTable.id, userId),
      with: {
        collection: true,
      }
    });
  }

  async getAllRidders() {
    return await this.db.select({
      id: RidderTable.id,
      userName: RidderTable.userName,
    }).from(RidderTable);
  }

  async getPaginationRidders(limit: number, offset: number) {
    return await this.db.select({
      id: RidderTable.id,
      userName: RidderTable.userName,
    }).from(RidderTable)
      .limit(limit)
      .offset(offset);
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  async updateRidderById(id: string, updateRidderDto: UpdateRidderDto) {
    return await this.db.update(RidderTable).set({
      userName: updateRidderDto.userName,
      email: updateRidderDto.email,
      password: updateRidderDto.password,
    }).where(eq(RidderTable.id, id))
      .returning({
        id: RidderTable.id,
    });
  }

  async updateRidderInfoByUserId(
    userId: string, 
    updateRidderInfoDto: UpdateRidderInfoDto,
  ) {
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
  }
  // note that we don't need to modify the collection
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  async deleteRiddderById(id: string) {
    return await this.db.delete(RidderTable)
      .where(eq(RidderTable.id, id));
  }
  /* ================================= Delete operations ================================= */
}