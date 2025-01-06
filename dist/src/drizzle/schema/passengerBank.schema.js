"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerBankRelation = exports.PassengerBankTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.PassengerBankTable = (0, pg_core_1.pgTable)("passengerBank", {
    customerId: (0, pg_core_1.text)("customerId").primaryKey(),
    userId: (0, pg_core_1.uuid)("userId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    balance: (0, pg_core_1.doublePrecision)("balance").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.uniqueIndex)("passengerBank_userIdIndex").on(table.userId),
        updatedAtIndex: (0, pg_core_1.index)("passengerBank_updatedAtIndex").on(table.updatedAt),
    };
});
exports.PassengerBankRelation = (0, drizzle_orm_1.relations)(exports.PassengerBankTable, ({ one }) => ({
    user: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PassengerBankTable.userId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=passengerBank.schema.js.map