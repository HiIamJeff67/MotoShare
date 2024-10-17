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
exports.PassengerInfoService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerInfo_schema_1 = require("../drizzle/schema/passengerInfo.schema");
const drizzle_orm_1 = require("drizzle-orm");
let PassengerInfoService = class PassengerInfoService {
    constructor(db) {
        this.db = db;
    }
    async createPassengerInfo(createPassengerInfoDto) {
        return await this.db.insert(passengerInfo_schema_1.PassengerInfoTable).values({
            userId: createPassengerInfoDto.userId,
            isOnline: createPassengerInfoDto.isOnline ?? false,
            age: createPassengerInfoDto.age ?? undefined,
            phoneNumber: createPassengerInfoDto.phoneNumber ?? undefined,
            selfIntroduction: createPassengerInfoDto.selfIntroduction ?? undefined,
            avatorUrl: createPassengerInfoDto.avatorUrl ?? undefined,
        }).returning({
            id: passengerInfo_schema_1.PassengerInfoTable.id,
            userId: passengerInfo_schema_1.PassengerInfoTable.userId,
        });
    }
    findAll() {
        return `This action returns all passengerInfo`;
    }
    findOne(id) {
        return `This action returns a #${id} passengerInfo`;
    }
    async updatePassengerInfoById(infoId, updatePassengerInfoDto) {
        return await this.db.update(passengerInfo_schema_1.PassengerInfoTable).set({
            isOnline: updatePassengerInfoDto.isOnline ?? false,
            age: updatePassengerInfoDto.age ?? undefined,
            phoneNumber: updatePassengerInfoDto.phoneNumber ?? undefined,
            selfIntroduction: updatePassengerInfoDto.selfIntroduction ?? undefined,
            avatorUrl: updatePassengerInfoDto.avatorUrl ?? undefined,
        }).where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.id, infoId)).returning({
            id: passengerInfo_schema_1.PassengerInfoTable.id,
            userId: passengerInfo_schema_1.PassengerInfoTable.userId,
        });
    }
    async updatePassengerInfoByUserId(userId, updatePassengerInfoDto) {
        return await this.db.update(passengerInfo_schema_1.PassengerInfoTable).set({
            isOnline: updatePassengerInfoDto.isOnline ?? false,
            age: updatePassengerInfoDto.age ?? undefined,
            phoneNumber: updatePassengerInfoDto.phoneNumber ?? undefined,
            selfIntroduction: updatePassengerInfoDto.selfIntroduction ?? undefined,
            avatorUrl: updatePassengerInfoDto.avatorUrl ?? undefined,
        }).where((0, drizzle_orm_1.eq)(passengerInfo_schema_1.PassengerInfoTable.userId, userId)).returning({
            id: passengerInfo_schema_1.PassengerInfoTable.id,
            userId: passengerInfo_schema_1.PassengerInfoTable.userId,
        });
    }
    remove(id) {
        return `This action removes a #${id} passengerInfo`;
    }
};
exports.PassengerInfoService = PassengerInfoService;
exports.PassengerInfoService = PassengerInfoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PassengerInfoService);
//# sourceMappingURL=passengerInfo.service.js.map