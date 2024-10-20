"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderInfoRelation = exports.RidderInfoTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ridder_schema_1 = require("./ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.RidderInfoTable = (0, pg_core_1.pgTable)("ridderInfo", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    isOnline: (0, pg_core_1.boolean)("isOnline").notNull().default(true),
    age: (0, pg_core_1.integer)("age"),
    phoneNumber: (0, pg_core_1.text)("phoneNumber").unique(),
    selfIntroduction: (0, pg_core_1.text)("selfIntroduction"),
    avatorUrl: (0, pg_core_1.text)("avatorUrl"),
    motocycleLicense: (0, pg_core_1.text)("motocycleLicense").unique(),
    motocyclePhotoUrl: (0, pg_core_1.text)("motocyclePhotoUrl"),
});
exports.RidderInfoRelation = (0, drizzle_orm_1.relations)(exports.RidderInfoTable, ({ one }) => ({
    user: one(ridder_schema_1.RidderTable, {
        fields: [exports.RidderInfoTable.userId],
        references: [ridder_schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=ridderInfo.schema.js.map