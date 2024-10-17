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
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passenger_schema_1 = require("../drizzle/schema/passenger.schema");
let PassengerService = class PassengerService {
    constructor(db) {
        this.db = db;
    }
    async createPassenger(createPassengerDto) {
        return await this.db.insert(passenger_schema_1.PassengerTable)
            .values({
            userName: createPassengerDto.userName,
            email: createPassengerDto.email,
            password: createPassengerDto.password,
        }).returning({
            id: passenger_schema_1.PassengerTable.id
        });
    }
    async getPassengerById(id) {
        return await this.db.select({
            id: passenger_schema_1.PassengerTable.id,
            userName: passenger_schema_1.PassengerTable.userName,
            email: passenger_schema_1.PassengerTable.email,
        }).from(passenger_schema_1.PassengerTable)
            .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id));
    }
    async getAllPassengers() {
        return await this.db.select({
            id: passenger_schema_1.PassengerTable.id,
            userName: passenger_schema_1.PassengerTable.userName,
        }).from(passenger_schema_1.PassengerTable);
    }
    async getPaginationPassengerIdAndName(limit, offset) {
        return await this.db.select({
            id: passenger_schema_1.PassengerTable.id,
            userName: passenger_schema_1.PassengerTable.userName,
        }).from(passenger_schema_1.PassengerTable)
            .limit(limit)
            .offset(offset);
    }
    async updatePassengerById(id, updatePassengerDto) {
        return await this.db.update(passenger_schema_1.PassengerTable).set({
            userName: updatePassengerDto.userName,
            email: updatePassengerDto.email,
            password: updatePassengerDto.password,
        }).where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id)).returning({
            id: passenger_schema_1.PassengerTable.id,
        });
    }
    async deletePassengerById(id) {
        return await this.db.delete(passenger_schema_1.PassengerTable)
            .where((0, drizzle_orm_1.eq)(passenger_schema_1.PassengerTable.id, id));
    }
};
exports.PassengerService = PassengerService;
exports.PassengerService = PassengerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PassengerService);
//# sourceMappingURL=passenger.service.js.map