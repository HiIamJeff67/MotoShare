"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderAuthRelation = exports.RidderAuthTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const ridder_schema_1 = require("./ridder.schema");
exports.RidderAuthTable = (0, pg_core_1.pgTable)("ridderAuth", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    isEmailAuthenticated: (0, pg_core_1.boolean)("isEmailAuthenticated").notNull().default(false),
    isPhoneAuthenticated: (0, pg_core_1.boolean)("isPhoneAuthenticated").notNull().default(false),
    authCode: (0, pg_core_1.text)("authCode").notNull(),
    authCodeExpiredAt: (0, pg_core_1.timestamp)("authCodeExpiredAt").notNull(),
});
exports.RidderAuthRelation = (0, drizzle_orm_1.relations)(exports.RidderAuthTable, ({ one }) => ({
    user: one(ridder_schema_1.RidderTable, {
        fields: [exports.RidderAuthTable.userId],
        references: [ridder_schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=ridderAuth.schema.js.map