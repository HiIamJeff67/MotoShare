import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { notificationTypeEnum } from "./enums";
import { relations } from "drizzle-orm";

export const PassengerNotificationTable = pgTable("passengerNotification", {
    id: uuid("id").primaryKey().defaultRandom(), 
    userId: uuid("userId").references(() => PassengerTable.id, {
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
        userIdIndex: index("passengerNotification_userIdIndex").on(table.userId), 
        createdAtIndex: index("passengerNotification_createdAtIndex").on(table.createdAt), 
    };
});

export const PassengerNotificationRelation = relations(PassengerNotificationTable, ({ one }) => ({
    passenger: one(PassengerTable, {
        fields: [PassengerNotificationTable.userId], 
        references: [PassengerTable.id], 
    }), 
}));
