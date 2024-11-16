"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderInfoRelation = exports.RidderInfoTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
exports.RidderInfoTable = (0, pg_core_1.pgTable)("ridderInfo", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    isOnline: (0, pg_core_1.boolean)("isOnline").notNull().default(true),
    age: (0, pg_core_1.integer)("age"),
    phoneNumber: (0, pg_core_1.text)("phoneNumber").unique(),
    selfIntroduction: (0, pg_core_1.text)("selfIntroduction"),
    avatorUrl: (0, pg_core_1.text)("avatorUrl"),
    motocycleLicense: (0, pg_core_1.text)("motocycleLicense").unique(),
    motocycleType: (0, pg_core_1.text)("motocycleType"),
    motocyclePhotoUrl: (0, pg_core_1.text)("motocyclePhotoUrl"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
});
exports.RidderInfoRelation = (0, drizzle_orm_1.relations)(exports.RidderInfoTable, ({ one }) => ({
    user: one(schema_1.RidderTable, {
        fields: [exports.RidderInfoTable.userId],
        references: [schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=ridderInfo.schema.js.map