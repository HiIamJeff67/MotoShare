"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderPreferencesRelation = exports.RidderPreferences = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const ridder_schema_1 = require("./ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.RidderPreferences = (0, pg_core_1.pgTable)("ridderPreferences", {
    userId: (0, pg_core_1.uuid)("userId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    preferenceUserId: (0, pg_core_1.uuid)("preferenceUserId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.preferenceUserId] }),
        userIdIndex: (0, pg_core_1.index)("ridderPreferences_userIdIndex").on(table.userId),
        preferenceUserIdIndex: (0, pg_core_1.index)("ridderPreferences_preferenceUserIdIndex").on(table.preferenceUserId),
    };
});
exports.RidderPreferencesRelation = (0, drizzle_orm_1.relations)(exports.RidderPreferences, ({ one }) => ({
    user: one(ridder_schema_1.RidderTable, {
        fields: [exports.RidderPreferences.userId],
        references: [ridder_schema_1.RidderTable.id],
    }),
    preferenceUser: one(passenger_schema_1.PassengerTable, {
        fields: [exports.RidderPreferences.preferenceUserId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=ridderPreferences.schema.js.map