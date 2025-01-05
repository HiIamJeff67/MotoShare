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
exports.RidderRecordService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const schema_1 = require("../drizzle/schema/schema");
const drizzle_orm_1 = require("drizzle-orm");
const exceptions_1 = require("../exceptions");
const constants_1 = require("../constants");
let RidderRecordService = class RidderRecordService {
    constructor(db) {
        this.db = db;
    }
    async storeSearchRecordByUserId(id, storeRidderRecordDto) {
        return await this.db.transaction(async (tx) => {
            const responseOfSelectingRidderRecord = await tx.select({
                searchRecords: schema_1.RidderRecordTable.searchRecords,
            }).from(schema_1.RidderRecordTable)
                .where((0, drizzle_orm_1.eq)(schema_1.RidderRecordTable.userId, id))
                .limit(1);
            if (!responseOfSelectingRidderRecord || responseOfSelectingRidderRecord.length === 0) {
                throw exceptions_1.ClientRidderRecordNotFoundException;
            }
            if (responseOfSelectingRidderRecord[0].searchRecords
                && responseOfSelectingRidderRecord[0].searchRecords.length >= constants_1.SEARCH_RECORD_MAX_LENGTH) {
                const trimLength = constants_1.SEARCH_RECORD_MAX_LENGTH - responseOfSelectingRidderRecord[0].searchRecords.length + 1;
                const responseOfMaintainSizeOfSearchRecords = await tx.update(schema_1.RidderRecordTable).set({
                    searchRecords: (0, drizzle_orm_1.sql) `${schema_1.RidderRecordTable.searchRecords}[1:GREATEST(array_length(${schema_1.RidderRecordTable.searchRecords}, 1) - ${trimLength}, 0)]`,
                }).where((0, drizzle_orm_1.eq)(schema_1.RidderRecordTable.userId, id))
                    .returning({
                    searchRecords: schema_1.RidderRecordTable.searchRecords,
                });
                if (!responseOfMaintainSizeOfSearchRecords || responseOfMaintainSizeOfSearchRecords.length === 0) {
                    throw exceptions_1.ClientMaintainSearchRecordsException;
                }
            }
            return await tx.update(schema_1.RidderRecordTable).set({
                searchRecords: (0, drizzle_orm_1.sql) `array_prepend(
          ${JSON.stringify(storeRidderRecordDto.searchRecord)}::jsonb, 
          ${schema_1.RidderRecordTable.searchRecords}
        )`,
            }).where((0, drizzle_orm_1.eq)(schema_1.RidderRecordTable.userId, id))
                .returning({
                searchRecords: schema_1.RidderRecordTable.searchRecords,
            });
        });
    }
    async getSearchRecordsByUserId(id) {
        return await this.db.select({
            searchRecords: schema_1.RidderRecordTable.searchRecords,
        }).from(schema_1.RidderRecordTable)
            .where((0, drizzle_orm_1.eq)(schema_1.RidderRecordTable.userId, id))
            .limit(1);
    }
};
exports.RidderRecordService = RidderRecordService;
exports.RidderRecordService = RidderRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], RidderRecordService);
//# sourceMappingURL=ridderRecord.service.js.map