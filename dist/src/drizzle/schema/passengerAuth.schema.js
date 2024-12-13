"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerAuthRelation = exports.PassengerAuthTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.PassengerAuthTable = (0, pg_core_1.pgTable)("passengerAuth", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
    isEmailAuthenticated: (0, pg_core_1.boolean)("isEmailAuthenticated").notNull().default(false),
    isPhoneAuthenticated: (0, pg_core_1.boolean)("isPhoneAuthenticated").notNull().default(false),
    authCode: (0, pg_core_1.text)("authCode").notNull(),
    authCodeExpiredAt: (0, pg_core_1.timestamp)("authCodeExpiredAt").notNull(),
    isDefaultAuthenticated: (0, pg_core_1.boolean)("isDefaultAuthenticated").notNull().default(false),
    isGoogleAuthenticated: (0, pg_core_1.boolean)("isGoogleAuthenticated").notNull().default(false),
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.uniqueIndex)("passengerAuth_userIdIndex").on(table.userId),
        authCodeIndex: (0, pg_core_1.index)("passengerAuth_authCodeIndex").on(table.authCode),
    };
});
exports.PassengerAuthRelation = (0, drizzle_orm_1.relations)(exports.PassengerAuthTable, ({ one }) => ({
    user: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PassengerAuthTable.userId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=passengerAuth.schema.js.map