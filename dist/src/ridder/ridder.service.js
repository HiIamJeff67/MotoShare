"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const ridderCollection_schema_1 = require("../drizzle/schema/ridderCollection.schema");
let RidderService = class RidderService {
    constructor(db) {
        this.db = db;
    }
    async createRidder(createRidderDto) {
        return await this.db.insert(ridder_schema_1.RidderTable).values({
            userName: createRidderDto.userName,
            email: createRidderDto.email,
            password: createRidderDto.password,
        }).returning({
            id: ridder_schema_1.RidderTable.id,
        });
    }
    async createRidderInfoByUserId(userId) {
        return await this.db.insert(ridderInfo_schema_1.RidderInfoTable).values({
            userId: userId
        }).returning({
            id: ridderInfo_schema_1.RidderInfoTable.id,
            userId: ridderInfo_schema_1.RidderInfoTable.userId,
        });
    }
    async createRidderCollectionByUserId(userId) {
        return await this.db.insert(ridderCollection_schema_1.RidderCollectionTable).values({
            userId: userId,
        }).returning({
            id: ridderCollection_schema_1.RidderCollectionTable.id,
            userId: ridderCollection_schema_1.RidderCollectionTable.userId,
        });
    }
    async signInRidderByEamilAndPassword(signInRidderDto) {
        return await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
            email: ridder_schema_1.RidderTable.email,
        }).from(ridder_schema_1.RidderTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.email, signInRidderDto.email), (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.password, signInRidderDto.password)))
            .limit(1);
    }
    async getRidderById(id) {
        return await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
            email: ridder_schema_1.RidderTable.email,
        }).from(ridder_schema_1.RidderTable)
            .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
            .limit(1);
    }
    async getRidderWithInfoByUserId(userId) {
        return await this.db.query.RidderTable.findFirst({
            where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId),
            with: {
                info: true,
            }
        });
    }
    async getRidderWithCollectionByUserId(userId) {
        return await this.db.query.RidderTable.findFirst({
            where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId),
            with: {
                collection: true,
            }
        });
    }
    async getAllRidders() {
        return await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
        }).from(ridder_schema_1.RidderTable);
    }
    async getPaginationRidders(limit, offset) {
        return await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
        }).from(ridder_schema_1.RidderTable)
            .limit(limit)
            .offset(offset);
    }
    async updateRidderById(id, updateRidderDto) {
        return await this.db.update(ridder_schema_1.RidderTable).set({
            userName: updateRidderDto.userName,
            email: updateRidderDto.email,
            password: updateRidderDto.password,
        }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
            .returning({
            id: ridder_schema_1.RidderTable.id,
        });
    }
    async updateRidderInfoByUserId(userId, updateRidderInfoDto) {
        return await this.db.update(ridderInfo_schema_1.RidderInfoTable).set({
            isOnline: updateRidderInfoDto.isOnline ?? false,
            age: updateRidderInfoDto.age ?? undefined,
            phoneNumber: updateRidderInfoDto.phoneNumber ?? undefined,
            selfIntroduction: updateRidderInfoDto.selfIntroduction ?? undefined,
            motocycleLicense: updateRidderInfoDto.motocycleLicense ?? undefined,
            motocyclePhotoUrl: updateRidderInfoDto.motocylePhotoUrl ?? undefined,
            avatorUrl: updateRidderInfoDto.avatorUrl ?? undefined,
        }).where((0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, userId))
            .returning({
            id: ridderInfo_schema_1.RidderInfoTable.id,
        });
    }
    async deleteRiddderById(id) {
        return await this.db.delete(ridder_schema_1.RidderTable)
            .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id));
    }
};
exports.RidderService = RidderService;
exports.RidderService = RidderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], RidderService);
//# sourceMappingURL=ridder.service.js.map