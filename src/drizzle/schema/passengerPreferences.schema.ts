import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { RidderTable } from "./ridder.schema";
import { relations } from "drizzle-orm";

export const PassengerPreferences = pgTable("passengerPreferences", {
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade', 
    }).notNull(), 
    preferenceUserId: uuid("preferenceUserId").references(() => RidderTable.id, {
        onDelete: 'cascade', 
    }).notNull(), 
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.preferenceUserId] }), 
        userIdIndex: index("passengerPreferences_userIdIndex").on(table.userId), 
        preferenceUserIdIndex: index("passengerPreferences_preferenceUserIdIndex").on(table.preferenceUserId), 
    };
});

export const PassengerPreferencesRelation = relations(PassengerPreferences, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerPreferences.userId], 
        references: [PassengerTable.id], 
    }), 
    preferenceUser: one(RidderTable, {
        fields: [PassengerPreferences.preferenceUserId], 
        references: [RidderTable.id], 
    }), 
}));