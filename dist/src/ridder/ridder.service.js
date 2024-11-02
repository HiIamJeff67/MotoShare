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
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const drizzle_orm_1 = require("drizzle-orm");
const ridder_schema_1 = require("../drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
let RidderService = class RidderService {
    constructor(config, db) {
        this.config = config;
        this.db = db;
    }
    async createRidder(createRidderDto) {
        try {
            const hash = await bcrypt.hash(createRidderDto.password, Number(this.config.get("SALT_OR_ROUND")));
            const response = await this.db.insert(ridder_schema_1.RidderTable).values({
                userName: createRidderDto.userName,
                email: createRidderDto.email,
                password: hash,
            }).returning({
                id: ridder_schema_1.RidderTable.id,
                userName: ridder_schema_1.RidderTable.userName,
            });
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async createRidderInfoByUserId(userId) {
        try {
            return await this.db.insert(ridderInfo_schema_1.RidderInfoTable).values({
                userId: userId
            }).returning({
                id: ridderInfo_schema_1.RidderInfoTable.id,
                userId: ridderInfo_schema_1.RidderInfoTable.userId,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getRidderById(id) {
        try {
            return await this.db.select({
                id: ridder_schema_1.RidderTable.id,
                userName: ridder_schema_1.RidderTable.userName,
                email: ridder_schema_1.RidderTable.email,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .limit(1);
        }
        catch (error) {
            throw error;
        }
    }
    async getRidderWithInfoByUserId(userId) {
        try {
            return await this.db.query.RidderTable.findFirst({
                where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId),
                with: {
                    info: true,
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getRidderWithCollectionByUserId(userId) {
        try {
            return await this.db.query.RidderTable.findFirst({
                where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId),
                with: {
                    collection: true,
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllRidders() {
        try {
            return await this.db.select({
                id: ridder_schema_1.RidderTable.id,
                userName: ridder_schema_1.RidderTable.userName,
            }).from(ridder_schema_1.RidderTable);
        }
        catch (error) {
            throw error;
        }
    }
    async getPaginationRidders(limit, offset) {
        try {
            return await this.db.select({
                id: ridder_schema_1.RidderTable.id,
                userName: ridder_schema_1.RidderTable.userName,
            }).from(ridder_schema_1.RidderTable)
                .limit(limit)
                .offset(offset);
        }
        catch (error) {
            throw error;
        }
    }
    async updateRidderById(id, updateRidderDto) {
        try {
            return await this.db.update(ridder_schema_1.RidderTable).set({
                userName: updateRidderDto.userName,
                email: updateRidderDto.email,
                password: updateRidderDto.password,
            }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .returning({
                id: ridder_schema_1.RidderTable.id,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async updateRidderInfoByUserId(userId, updateRidderInfoDto) {
        try {
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
        catch (error) {
            throw error;
        }
    }
    async deleteRiddderById(id) {
        try {
            return await this.db.delete(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id));
        }
        catch (error) {
            throw error;
        }
    }
    async testBcryptHashing(secretText, hash) {
        if (!hash) {
            hash = await bcrypt.hash(secretText, Number(this.config.get("SALT_OR_ROUND")));
        }
        const isMatch = await bcrypt.compare(secretText, hash);
        return {
            originalData: secretText,
            hashData: hash,
            isMatch: isMatch,
        };
    }
};
exports.RidderService = RidderService;
exports.RidderService = RidderService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], RidderService);
//# sourceMappingURL=ridder.service.js.map