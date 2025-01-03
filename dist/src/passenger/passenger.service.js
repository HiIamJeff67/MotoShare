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
exports.PassengerService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("../../src/drizzle/drizzle.module");
const passenger_schema_1 = require("../../src/drizzle/schema/passenger.schema");
const passengerInfo_schema_1 = require("../../src/drizzle/schema/passengerInfo.schema");
const exceptions_1 = require("../exceptions");
const supabaseStorage_service_1 = require("../supabaseStorage/supabaseStorage.service");
const ridderInfo_schema_1 = require("../drizzle/schema/ridderInfo.schema");
const passengerAuth_schema_1 = require("../drizzle/schema/passengerAuth.schema");
let PassengerService = class PassengerService {
    constructor(config, storage, db) {
        this.config = config;
        this.storage = storage;
        this.db = db;
    }
    async _getPassengerById(id) {
        const response = await this.db.select({
            id: passenger_schema_1.PassengerTable.id,
            userName: passenger_schema_1.PassengerTable.userName,
            email: passenger_schema_1.PassengerTable.email,
            hash: passenger_schema_1.PassengerTable.password,
        }).from(passenger_schema_1.PassengerTable)
            .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
            .limit(1);
        return response && response.length > 0 ? response[0] : undefined;
    }
    async getPassengerWithInfoByUserName(userName) {
        return await this.db.query.PassengerTable.findFirst({
            where: (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.userName, userName),
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
                        createdAt: true,
                        updatedAt: true,
                        avgStarRating: true,
                    }
                },
            }
        });
    }
    async getPassengerWithInfoByPhoneNumber(phoneNumber) {
        return await this.db.query.PassengerInfoTable.findFirst({
            where: (0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.phoneNumber, phoneNumber),
            columns: {
                isOnline: true,
                age: true,
                selfIntroduction: true,
                avatorUrl: true,
                createdAt: true,
                updatedAt: true,
                avgStarRating: true,
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
    async getPassengerWithInfoByUserId(userId) {
        return await this.db.query.PassengerTable.findFirst({
            where: (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, userId),
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
                        createdAt: true,
                        updatedAt: true,
                        avgStarRating: true,
                    }
                },
            }
        });
    }
    async getPassengerWithCollectionByUserId(userId) {
        return await this.db.query.PassengerTable.findFirst({
            where: (0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, userId),
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
    async searchPaginationPassengers(userName = undefined, limit, offset) {
        return await this.db.query.PassengerTable.findMany({
            ...(userName && { where: (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, userName + "%") }),
            columns: {
                userName: true,
                email: true,
            },
            with: {
                info: {
                    columns: {
                        avatorUrl: true,
                        isOnline: true,
                        avgStarRating: true,
                    }
                }
            },
            orderBy: passenger_schema_1.PassengerTable.userName,
            limit: limit,
            offset: offset,
        });
    }
    async updatePassengerById(id, updatePassengerDto) {
        const user = await this._getPassengerById(id);
        if (!user) {
            throw exceptions_1.ClientPassengerNotFoundException;
        }
        if (updatePassengerDto.userName && updatePassengerDto.userName.length !== 0) {
            const unMatches = updatePassengerDto.userName === user.userName;
            if (unMatches)
                throw exceptions_1.ClientNoChangeOnUserNameException;
        }
        return await this.db.update(passenger_schema_1.PassengerTable).set({
            userName: updatePassengerDto.userName,
        }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
            .returning({
            userName: passenger_schema_1.PassengerTable.userName,
            eamil: passenger_schema_1.PassengerTable.email,
        });
    }
    async updatePassengerInfoByUserId(userId, updatePassengerInfoDto, uploadedAvatorFile = undefined) {
        return await this.db.transaction(async (tx) => {
            const passengerInfo = await tx.select({
                infoId: passengerInfo_schema_1.PassengerInfoTable.id,
            }).from(passengerInfo_schema_1.PassengerInfoTable)
                .where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, userId));
            if (!passengerInfo || passengerInfo.length === 0)
                throw exceptions_1.ClientPassengerNotFoundException;
            let emergencyUserRole = undefined;
            if (updatePassengerInfoDto.emergencyPhoneNumber) {
                emergencyUserRole = "Guest";
                const passenger = await tx.select({
                    id: passengerInfo_schema_1.PassengerInfoTable.id,
                }).from(passengerInfo_schema_1.PassengerInfoTable)
                    .where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.emergencyPhoneNumber, updatePassengerInfoDto.emergencyPhoneNumber));
                if (passenger && passenger.length !== 0) {
                    emergencyUserRole = "Passenger";
                }
                else {
                    const ridder = await tx.select({
                        id: ridderInfo_schema_1.RidderInfoTable.id,
                    }).from(ridderInfo_schema_1.RidderInfoTable)
                        .where((0, drizzle_orm_1.eq)(ridderInfo_schema_1.RidderInfoTable.emergencyPhoneNumber, updatePassengerInfoDto.emergencyPhoneNumber));
                    if (ridder && ridder.length !== 0) {
                        emergencyUserRole = "Ridder";
                    }
                }
            }
            if (updatePassengerInfoDto.phoneNumber && updatePassengerInfoDto.phoneNumber.length !== 0) {
                const responseOfUpdatingPassengerAuth = await tx.update(passengerAuth_schema_1.PassengerAuthTable).set({
                    isPhoneAuthenticated: false,
                }).where((0, drizzle_orm_1.eq)(passengerAuth_schema_1.PassengerAuthTable.userId, userId))
                    .returning();
                if (!responseOfUpdatingPassengerAuth || responseOfUpdatingPassengerAuth.length === 0) {
                    throw exceptions_1.ClientPassengerAuthNotFoundException;
                }
            }
            return await tx.update(passengerInfo_schema_1.PassengerInfoTable).set({
                isOnline: updatePassengerInfoDto.isOnline,
                age: updatePassengerInfoDto.age,
                phoneNumber: updatePassengerInfoDto.phoneNumber,
                ...(emergencyUserRole !== undefined && { emergencyUserRole: emergencyUserRole }),
                emergencyPhoneNumber: updatePassengerInfoDto.emergencyPhoneNumber,
                selfIntroduction: updatePassengerInfoDto.selfIntroduction,
                ...(uploadedAvatorFile
                    ? { avatorUrl: await this.storage.uploadAvatorFile(passengerInfo[0].infoId, "passengerAvators", uploadedAvatorFile)
                    }
                    : {}),
                updatedAt: new Date(),
            }).where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, userId))
                .returning({
                isOnline: passengerInfo_schema_1.PassengerInfoTable.isOnline,
                age: passengerInfo_schema_1.PassengerInfoTable.age,
                phoneNumber: passengerInfo_schema_1.PassengerInfoTable.phoneNumber,
                emergencyPhoneNumber: passengerInfo_schema_1.PassengerInfoTable.emergencyPhoneNumber,
                emergencyUserRole: passengerInfo_schema_1.PassengerInfoTable.emergencyUserRole,
                selfIntroduction: passengerInfo_schema_1.PassengerInfoTable.selfIntroduction,
                avatorUrl: passengerInfo_schema_1.PassengerInfoTable.avatorUrl,
            });
        });
    }
    async resetPassengerAccessTokenById(id) {
        return await this.db.update(passenger_schema_1.PassengerTable).set({
            accessToken: "LOGGED_OUT",
        }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
            .returning({
            accessToken: passenger_schema_1.PassengerTable.accessToken,
        });
    }
    async deletePassengerById(id, deletePassengerDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassenger = await tx.select({
                hash: passenger_schema_1.PassengerTable.password,
            }).from(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id));
            if (!responseOfSelectingPassenger || responseOfSelectingPassenger.length === 0) {
                throw exceptions_1.ClientPassengerNotFoundException;
            }
            const pwMatches = await bcrypt.compare(deletePassengerDto.password, responseOfSelectingPassenger[0].hash);
            if (!pwMatches)
                throw exceptions_1.ClientDeleteAccountPasswordNotMatchException;
            return await tx.delete(passenger_schema_1.PassengerTable)
                .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning({
                id: passenger_schema_1.PassengerTable.id,
                userName: passenger_schema_1.PassengerTable.userName,
                email: passenger_schema_1.PassengerTable.email,
            });
        });
    }
    async getAllPassengers() {
        return await this.db.select({
            id: passenger_schema_1.PassengerTable.id,
            userName: passenger_schema_1.PassengerTable.userName,
        }).from(passenger_schema_1.PassengerTable);
    }
};
exports.PassengerService = PassengerService;
exports.PassengerService = PassengerService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabaseStorage_service_1.SupabaseStorageService, Object])
], PassengerService);
//# sourceMappingURL=passenger.service.js.map