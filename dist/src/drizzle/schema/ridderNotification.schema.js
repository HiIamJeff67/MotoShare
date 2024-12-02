"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderNotificationRelation = exports.RidderNotificationTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ridder_schema_1 = require("./ridder.schema");
const enums_1 = require("./enums");
const drizzle_orm_1 = require("drizzle-orm");
exports.RidderNotificationTable = (0, pg_core_1.pgTable)("ridderNotification", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => ridder_schema_1.RidderTable.id, {
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
        userIdIndex: (0, pg_core_1.index)("ridderNotification_userIdIndex").on(table.userId),
        createdAtIndex: (0, pg_core_1.index)("ridderNotification_createdAtIndex").on(table.createdAt),
    };
});
exports.RidderNotificationRelation = (0, drizzle_orm_1.relations)(exports.RidderNotificationTable, ({ one }) => ({
    ridder: one(ridder_schema_1.RidderTable, {
        fields: [exports.RidderNotificationTable.userId],
        references: [ridder_schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=ridderNotification.schema.js.map