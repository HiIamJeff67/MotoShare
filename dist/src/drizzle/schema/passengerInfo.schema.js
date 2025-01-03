"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerInfoRelation = exports.PassengerInfoTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.PassengerInfoTable = (0, pg_core_1.pgTable)("passengerInfo", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    isOnline: (0, pg_core_1.boolean)("isOnline").notNull().default(true),
    age: (0, pg_core_1.integer)("age"),
    phoneNumber: (0, pg_core_1.text)("phoneNumber").unique(),
    emergencyUserRole: (0, enums_1.userRoleEnum)(),
    emergencyPhoneNumber: (0, pg_core_1.text)("emergencyPhoneNumber"),
    selfIntroduction: (0, pg_core_1.text)("selfIntroduction"),
    avatorUrl: (0, pg_core_1.text)("avatorUrl"),
    avgStarRating: (0, pg_core_1.doublePrecision)("averageStarRating").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.uniqueIndex)("passengerInfo_userIdIndex").on(table.userId),
        phoneNumberIndex: (0, pg_core_1.uniqueIndex)("passengerInfo_phoneNumberIndex").on(table.phoneNumber),
    };
});
exports.PassengerInfoRelation = (0, drizzle_orm_1.relations)(exports.PassengerInfoTable, ({ one }) => ({
    user: one(schema_1.PassengerTable, {
        fields: [exports.PassengerInfoTable.userId],
        references: [schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=passengerInfo.schema.js.map