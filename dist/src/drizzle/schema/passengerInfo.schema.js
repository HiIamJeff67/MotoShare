"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerInfoRelation = exports.PassengerInfoTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
exports.PassengerInfoTable = (0, pg_core_1.pgTable)("passengerInfo", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    isOnline: (0, pg_core_1.boolean)("isOnline").notNull().default(true),
    age: (0, pg_core_1.integer)("age"),
    phoneNumber: (0, pg_core_1.text)("phoneNumber").unique(),
    selfIntroduction: (0, pg_core_1.text)("selfIntroduction"),
    avatorUrl: (0, pg_core_1.text)("avatorUrl"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
});
exports.PassengerInfoRelation = (0, drizzle_orm_1.relations)(exports.PassengerInfoTable, ({ one }) => ({
    user: one(schema_1.PassengerTable, {
        fields: [exports.PassengerInfoTable.userId],
        references: [schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=passengerInfo.schema.js.map