"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerRelation = exports.PassengerTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const passengerNotification_schema_1 = require("./passengerNotification.schema");
exports.PassengerTable = (0, pg_core_1.pgTable)("passenger", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userName: (0, pg_core_1.text)("userName").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    accessToken: (0, pg_core_1.text)("accessToken").notNull().unique(),
}, (table) => {
    return {
        userNameIndex: (0, pg_core_1.uniqueIndex)("passenger_userNameIndex").on(table.userName),
        emailIndex: (0, pg_core_1.uniqueIndex)("passenger_emailIndex").on(table.email),
    };
});
exports.PassengerRelation = (0, drizzle_orm_1.relations)(exports.PassengerTable, ({ one, many }) => ({
    info: one(schema_1.PassengerInfoTable),
    collection: many(schema_1.PassengerCollectionsToOrders),
    purchaseOrders: many(schema_1.PurchaseOrderTable),
    orders: many(schema_1.OrderTable),
    historyOrders: many(schema_1.HistoryTable),
    invite: many(schema_1.PassengerInviteTable),
    notification: many(passengerNotification_schema_1.PassengerNotificationTable),
    preferences: many(schema_1.PassengerPreferences),
    preferencedBy: many(schema_1.RidderPreferences),
    periodicPurchaseOrders: many(schema_1.PeriodicPurchaseOrderTable),
    record: one(schema_1.PassengerRecordTable),
}));
//# sourceMappingURL=passenger.schema.js.map