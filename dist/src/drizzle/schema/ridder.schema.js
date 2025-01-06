"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderRelation = exports.RidderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const ridderNotification_schema_1 = require("./ridderNotification.schema");
exports.RidderTable = (0, pg_core_1.pgTable)("ridder", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userName: (0, pg_core_1.text)("userName").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    accessToken: (0, pg_core_1.text)("accessToken").notNull(),
}, (table) => {
    return {
        userNameIndex: (0, pg_core_1.uniqueIndex)("ridder_userNameIndex").on(table.userName),
        emailIndex: (0, pg_core_1.uniqueIndex)("ridder_emailIndex").on(table.email),
    };
});
exports.RidderRelation = (0, drizzle_orm_1.relations)(exports.RidderTable, ({ one, many }) => ({
    info: one(schema_1.RidderInfoTable),
    collection: many(schema_1.RidderCollectionsToOrders),
    supplyOrder: many(schema_1.SupplyOrderTable),
    order: many(schema_1.OrderTable),
    history: many(schema_1.HistoryTable),
    invite: many(schema_1.RidderInviteTable),
    notification: many(ridderNotification_schema_1.RidderNotificationTable),
    preferences: many(schema_1.RidderPreferences),
    preferencedBy: many(schema_1.PassengerPreferences),
    periodicSupplyOrders: many(schema_1.PeriodicSupplyOrderTable),
    record: one(schema_1.RidderRecordTable),
    bank: one(schema_1.RidderBankTable),
}));
//# sourceMappingURL=ridder.schema.js.map