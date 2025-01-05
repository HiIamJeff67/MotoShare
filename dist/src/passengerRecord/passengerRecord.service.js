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
exports.PassengerRecordService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const passengerRecord_schema_1 = require("../drizzle/schema/passengerRecord.schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const constants_1 = require("../constants");
let PassengerRecordService = class PassengerRecordService {
    constructor(db) {
        this.db = db;
    }
    async storeSearchRecordByUserId(id, storePassengerRecordDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingPassengerRecord = await tx.select({
                searchRecords: passengerRecord_schema_1.PassengerRecordTable.searchRecords,
            }).from(passengerRecord_schema_1.PassengerRecordTable)
                .where((0, drizzle_orm_1.eq)(passengerRecord_schema_1.PassengerRecordTable.userId, id))
                .limit(1);
            if (!responseOfSelectingPassengerRecord || responseOfSelectingPassengerRecord.length === 0) {
                throw exceptions_1.ClientPassengerRecordNotFoundException;
            }
            if (responseOfSelectingPassengerRecord[0].searchRecords
                && responseOfSelectingPassengerRecord[0].searchRecords.length >= constants_1.SEARCH_RECORD_MAX_LENGTH) {
                const trimLength = constants_1.SEARCH_RECORD_MAX_LENGTH - responseOfSelectingPassengerRecord[0].searchRecords.length + 1;
                const responseOfMaintainSizeOfSearchRecords = await tx.update(passengerRecord_schema_1.PassengerRecordTable).set({
                    searchRecords: (0, drizzle_orm_1.sql) `${passengerRecord_schema_1.PassengerRecordTable.searchRecords}[1:GREATEST(array_length(${passengerRecord_schema_1.PassengerRecordTable.searchRecords}, 1) - ${trimLength}, 0)]`,
                }).where((0, drizzle_orm_1.eq)(passengerRecord_schema_1.PassengerRecordTable.userId, id))
                    .returning({
                    searchRecords: passengerRecord_schema_1.PassengerRecordTable.searchRecords,
                });
                if (!responseOfMaintainSizeOfSearchRecords || responseOfMaintainSizeOfSearchRecords.length === 0) {
                    throw exceptions_1.ClientMaintainSearchRecordsException;
                }
            }
            return await tx.update(passengerRecord_schema_1.PassengerRecordTable).set({
                searchRecords: (0, drizzle_orm_1.sql) `array_prepend(
          ${JSON.stringify(storePassengerRecordDto.searchRecord)}::jsonb, 
          ${passengerRecord_schema_1.PassengerRecordTable.searchRecords}
        )`,
            }).where((0, drizzle_orm_1.eq)(passengerRecord_schema_1.PassengerRecordTable.userId, id))
                .returning({
                searchRecords: passengerRecord_schema_1.PassengerRecordTable.searchRecords,
            });
        });
    }
    async getSearchRecordsByUserId(id) {
        return await this.db.select({
            searchRecords: passengerRecord_schema_1.PassengerRecordTable.searchRecords,
        }).from(passengerRecord_schema_1.PassengerRecordTable)
            .where((0, drizzle_orm_1.eq)(passengerRecord_schema_1.PassengerRecordTable.userId, id))
            .limit(1);
    }
};
exports.PassengerRecordService = PassengerRecordService;
exports.PassengerRecordService = PassengerRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PassengerRecordService);
//# sourceMappingURL=passengerRecord.service.js.map