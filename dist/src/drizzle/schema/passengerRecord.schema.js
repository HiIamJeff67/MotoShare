"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerRecordRelation = exports.PassengerRecordTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.PassengerRecordTable = (0, pg_core_1.pgTable)("passengerRecord", {
    id: (0, pg_core_1.uuid)("id").defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: "cascade",
    }).unique(),
    searchRecords: (0, pg_core_1.jsonb)().array().notNull().default((0, drizzle_orm_1.sql) `ARRAY[]::jsonb[]`),
}, (table) => {
    return {
        userdIdIndex: (0, pg_core_1.uniqueIndex)("passengerRecord_userIdIndex").on(table.userId),
    };
});
exports.PassengerRecordRelation = (0, drizzle_orm_1.relations)(exports.PassengerRecordTable, ({ one }) => ({
    user: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PassengerRecordTable.userId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=passengerRecord.schema.js.map