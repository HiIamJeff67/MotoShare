"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerPreferencesRelation = exports.PassengerPreferences = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const ridder_schema_1 = require("./ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.PassengerPreferences = (0, pg_core_1.pgTable)("passengerPreferences", {
    userId: (0, pg_core_1.uuid)("userId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    preferenceUserId: (0, pg_core_1.uuid)("preferenceUserId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.preferenceUserId] }),
        userIdIndex: (0, pg_core_1.index)("passengerPreferences_userIdIndex").on(table.userId),
        preferenceUserIdIndex: (0, pg_core_1.index)("passengerPreferences_preferenceUserIdIndex").on(table.preferenceUserId),
    };
});
exports.PassengerPreferencesRelation = (0, drizzle_orm_1.relations)(exports.PassengerPreferences, ({ one }) => ({
    user: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PassengerPreferences.userId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
    preferenceUser: one(ridder_schema_1.RidderTable, {
        fields: [exports.PassengerPreferences.preferenceUserId],
        references: [ridder_schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=passengerPreferences.schema.js.map