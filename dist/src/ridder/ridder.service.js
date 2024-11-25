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
const drizzle_orm_1 = require("drizzle-orm");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const ridder_schema_1 = require("../../src/drizzle/schema/ridder.schema");
const ridderInfo_schema_1 = require("../../src/drizzle/schema/ridderInfo.schema");
const exceptions_1 = require("../exceptions");
const supabaseStorage_service_1 = require("../supabaseStorage/supabaseStorage.service");
let RidderService = class RidderService {
    constructor(storage, config, db) {
        this.storage = storage;
        this.config = config;
        this.db = db;
    }
    async getRidderById(id) {
        const response = await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
            email: ridder_schema_1.RidderTable.email,
            hash: ridder_schema_1.RidderTable.password,
        }).from(ridder_schema_1.RidderTable)
            .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
            .limit(1);
        return response && response.length > 0 ? response[0] : undefined;
    }
    async getRidderWithInfoByUserName(userName) {
        return await this.db.query.RidderTable.findFirst({
            where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.userName, userName),
            columns: {
                userName: true,
                email: true,
            },
            with: {
                info: {
                    columns: {
                        isOnline: true,
                        age: true,
                        selfIntroduction: true,
                        avatorUrl: true,
                        motocycleType: true,
                        motocyclePhotoUrl: true,
                        updatedAt: true,
                    }
                },
            }
        });
    }
    async getRidderWithInfoByUserId(userId) {
        return await this.db.query.RidderTable.findFirst({
            where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId),
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
                        updatedAt: true,
                    }
                },
            }
        });
    }
    async getRidderWithCollectionByUserId(userId) {
        return await this.db.query.RidderTable.findFirst({
            where: (0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, userId),
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
    async searchPaginationRidders(userName = undefined, limit, offset) {
        return await this.db.query.RidderTable.findMany({
            ...(userName && { where: (0, drizzle_orm_1.like)(ridder_schema_1.RidderTable.userName, userName + "%") }),
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
            orderBy: ridder_schema_1.RidderTable.userName,
            limit: limit,
            offset: offset,
        });
    }
    async updateRidderById(id, updateRidderDto) {
        const user = await this.getRidderById(id);
        if (!user) {
            throw exceptions_1.ClientRidderNotFoundException;
        }
        if (updateRidderDto.userName && updateRidderDto.userName.length !== 0) {
            const unMatches = updateRidderDto.userName === user.userName;
            if (unMatches)
                throw exceptions_1.ClientNoChangeOnUserNameException;
        }
        return await this.db.update(ridder_schema_1.RidderTable).set({
            userName: updateRidderDto.userName,
        }).where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
            .returning({
            userName: ridder_schema_1.RidderTable.userName,
            eamil: ridder_schema_1.RidderTable.email,
        });
    }
    async updateRidderInfoByUserId(userId, updateRidderInfoDto, uploadedFile = undefined) {
        return await this.db.transaction(async (tx) => {
            const ridderInfo = await tx.select({
                infoId: ridderInfo_schema_1.RidderInfoTable.id,
            }).from(ridderInfo_schema_1.RidderInfoTable)
                .where((0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, userId));
            if (!ridderInfo || ridderInfo.length === 0)
                throw exceptions_1.ClientRidderNotFoundException;
            return await tx.update(ridderInfo_schema_1.RidderInfoTable).set({
                isOnline: updateRidderInfoDto.isOnline,
                age: updateRidderInfoDto.age,
                phoneNumber: updateRidderInfoDto.phoneNumber,
                selfIntroduction: updateRidderInfoDto.selfIntroduction,
                motocycleLicense: updateRidderInfoDto.motocycleLicense,
                motocyclePhotoUrl: updateRidderInfoDto.motocylePhotoUrl,
                motocycleType: updateRidderInfoDto.motocycleType,
                ...(uploadedFile
                    ? { avatorUrl: await this.storage.uploadFile(ridderInfo[0].infoId, "AvatorBucket", "ridderAvators/", uploadedFile)
                    }
                    : {}),
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.userId, userId));
        });
    }
    async deleteRiddderById(id, deleteRidderDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingRidder = await tx.select({
                hash: ridder_schema_1.RidderTable.password,
            }).from(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id));
            if (!responseOfSelectingRidder || responseOfSelectingRidder.length === 0) {
                throw exceptions_1.ClientRidderNotFoundException;
            }
            const pwMatches = await bcrypt.compare(deleteRidderDto.password, responseOfSelectingRidder[0].hash);
            if (!pwMatches)
                throw exceptions_1.ClientDeleteAccountPasswordNotMatchException;
            return await tx.delete(ridder_schema_1.RidderTable)
                .where((0, drizzle_orm_1.eq)(ridder_schema_1.RidderTable.id, id))
                .returning({
                id: ridder_schema_1.RidderTable.id,
                userName: ridder_schema_1.RidderTable.userName,
                email: ridder_schema_1.RidderTable.email,
            });
        });
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
    async getAllRidders() {
        return await this.db.select({
            id: ridder_schema_1.RidderTable.id,
            userName: ridder_schema_1.RidderTable.userName,
        }).from(ridder_schema_1.RidderTable);
    }
};
exports.RidderService = RidderService;
exports.RidderService = RidderService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [supabaseStorage_service_1.SupabaseStorageService,
        config_1.ConfigService, Object])
], RidderService);
//# sourceMappingURL=ridder.service.js.map