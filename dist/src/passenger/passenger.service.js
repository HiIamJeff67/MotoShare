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
let PassengerService = class PassengerService {
    constructor(config, db) {
        this.config = config;
        this.db = db;
    }
    async getPassengerById(id) {
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
                        phoneNumber: true,
                        selfIntroduction: true,
                        avatorUrl: true,
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
                        selfIntroduction: true,
                        avatorUrl: true,
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
    async searchPassengersByUserName(userName, limit, offset) {
        return await this.db.query.PassengerTable.findMany({
            where: (0, drizzle_orm_1.like)(passenger_schema_1.PassengerTable.userName, userName + "%"),
            columns: {
                userName: true,
                email: true,
            },
            with: {
                info: {
                    columns: {
                        selfIntroduction: true,
                        avatorUrl: true,
                    }
                }
            },
            limit: limit,
            offset: offset,
        });
    }
    async searchPaginationPassengers(limit, offset) {
        return await this.db.query.PassengerTable.findMany({
            columns: {
                userName: true,
                email: true,
            },
            with: {
                info: {
                    columns: {
                        selfIntroduction: true,
                        avatorUrl: true,
                    }
                }
            },
            orderBy: passenger_schema_1.PassengerTable.userName,
            limit: limit,
            offset: offset,
        });
    }
    async updatePassengerById(id, updatePassengerDto) {
        const user = await this.getPassengerById(id);
        if (!user) {
            throw new common_1.NotFoundException(`Cannot find the passenger with the given id`);
        }
        if (updatePassengerDto.userName && updatePassengerDto.userName.length !== 0) {
            const unMatches = updatePassengerDto.userName === user.userName;
            if (unMatches) {
                throw new common_1.ConflictException(`Duplicated userName ${updatePassengerDto.userName} detected, please use a different userName`);
            }
        }
        if (updatePassengerDto.email && updatePassengerDto.email.length !== 0) {
            const emMatches = updatePassengerDto.email === user.email;
            if (emMatches) {
                throw new common_1.ConflictException(`Duplicated email ${updatePassengerDto.email} detected, please use a different email`);
            }
        }
        if (updatePassengerDto.password && updatePassengerDto.password.length !== 0) {
            const pwMatches = await bcrypt.compare(updatePassengerDto.password, user.hash);
            if (pwMatches) {
                throw new common_1.ConflictException(`Duplicated credential detected, please use a different password`);
            }
            const hash = await bcrypt.hash(updatePassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
            return await this.db.update(passenger_schema_1.PassengerTable).set({
                userName: updatePassengerDto.userName,
                email: updatePassengerDto.email,
                password: hash,
            }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
                .returning({
                userName: passenger_schema_1.PassengerTable.userName,
                eamil: passenger_schema_1.PassengerTable.email,
            });
        }
        return await this.db.update(passenger_schema_1.PassengerTable).set({
            userName: updatePassengerDto.userName,
            email: updatePassengerDto.email,
        }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
            .returning({
            userName: passenger_schema_1.PassengerTable.userName,
            eamil: passenger_schema_1.PassengerTable.email,
        });
    }
    async updatePassengerInfoByUserId(userId, updatePassengerInfoDto) {
        return await this.db.update(passengerInfo_schema_1.PassengerInfoTable).set({
            isOnline: updatePassengerInfoDto.isOnline,
            age: updatePassengerInfoDto.age,
            phoneNumber: updatePassengerInfoDto.phoneNumber,
            selfIntroduction: updatePassengerInfoDto.selfIntroduction,
            avatorUrl: updatePassengerInfoDto.avatorUrl,
        }).where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, userId));
    }
    async deletePassengerById(id) {
        return await this.db.delete(passenger_schema_1.PassengerTable)
            .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id))
            .returning({
            id: passenger_schema_1.PassengerTable.id,
            userName: passenger_schema_1.PassengerTable.userName,
            email: passenger_schema_1.PassengerTable.email,
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
    __param(1, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], PassengerService);
//# sourceMappingURL=passenger.service.js.map