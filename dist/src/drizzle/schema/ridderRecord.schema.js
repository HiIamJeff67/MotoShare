"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderRecordRelation = exports.RidderRecordTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("./schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.RidderRecordTable = (0, pg_core_1.pgTable)("ridderRecord", {
    id: (0, pg_core_1.uuid)("id").defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.RidderTable.id, {
        onDelete: "cascade",
    }).unique(),
    searchRecords: (0, pg_core_1.jsonb)().array().notNull().default((0, drizzle_orm_1.sql) `ARRAY[]::jsonb[]`),
}, (table) => {
    return {
        userdIdIndex: (0, pg_core_1.uniqueIndex)("ridderRecord_userIdIndex").on(table.userId),
    };
});
exports.RidderRecordRelation = (0, drizzle_orm_1.relations)(exports.RidderRecordTable, ({ one }) => ({
    user: one(schema_1.RidderTable, {
        fields: [exports.RidderRecordTable.userId],
        references: [schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=ridderRecord.schema.js.map