import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { RidderTable } from "./ridder.schema";
import { notificationTypeEnum } from "./enums";
import { relations } from "drizzle-orm";

export const RidderNotificationTable = pgTable("ridderNotification", {
    id: uuid("id").primaryKey().defaultRandom(), 
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade', 
    }), 
    title: text("title").notNull(), 
    description: text("description"), 
    notificationType: notificationTypeEnum("notificationType").notNull(), 
    linkId: text("linkId"), 
    isRead: boolean("isRead").notNull().default(false), 
    createdAt: timestamp("createdAt").notNull().defaultNow(), 
}, (table) => {
    return {
        userIdIndex: index("ridderNotification_userIdIndex").on(table.userId), 
        createdAtIndex: index("ridderNotification_createdAtIndex").on(table.createdAt), 
    };
});

export const RidderNotificationRelation = relations(RidderNotificationTable, ({ one }) => ({
    ridder: one(RidderTable, {
        fields: [RidderNotificationTable.userId], 
        references: [RidderTable.id], 
    }), 
}));
