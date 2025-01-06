"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderBankRelation = exports.RidderBankTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ridder_schema_1 = require("./ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.RidderBankTable = (0, pg_core_1.pgTable)("ridderBank", {
    customerId: (0, pg_core_1.text)("customerId").primaryKey(),
    userId: (0, pg_core_1.uuid)("userId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    balance: (0, pg_core_1.doublePrecision)("balance").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.uniqueIndex)("ridderBank_userIdIndex").on(table.userId),
        updatedAtIndex: (0, pg_core_1.index)("ridderBank_updatedAtIndex").on(table.updatedAt),
    };
});
exports.RidderBankRelation = (0, drizzle_orm_1.relations)(exports.RidderBankTable, ({ one }) => ({
    user: one(ridder_schema_1.RidderTable, {
        fields: [exports.RidderBankTable.userId],
        references: [ridder_schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=ridderBank.schema.js.map