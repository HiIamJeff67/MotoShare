"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerNotificationRelation = exports.PassengerNotificationTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const enums_1 = require("./enums");
const drizzle_orm_1 = require("drizzle-orm");
exports.PassengerNotificationTable = (0, pg_core_1.pgTable)("passengerNotification", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    notificationType: (0, enums_1.notificationTypeEnum)("notificationType").notNull(),
    linkId: (0, pg_core_1.text)("linkId"),
    isRead: (0, pg_core_1.boolean)("isRead").notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("passengerNotification_userIdIndex").on(table.userId),
        createdAtIndex: (0, pg_core_1.index)("passengerNotification_createdAtIndex").on(table.createdAt),
    };
});
exports.PassengerNotificationRelation = (0, drizzle_orm_1.relations)(exports.PassengerNotificationTable, ({ one }) => ({
    passenger: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PassengerNotificationTable.userId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=passengerNotification.schema.js.map