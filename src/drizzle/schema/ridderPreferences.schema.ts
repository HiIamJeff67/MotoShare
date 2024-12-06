import { pgTable, uuid, index, primaryKey } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { RidderTable } from "./ridder.schema";
import { relations } from "drizzle-orm";

export const RidderPreferences = pgTable("ridderPreferences", {
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade', 
    }).notNull(), 
    preferenceUserId: uuid("preferenceUserId").references(() => PassengerTable.id, {
        onDelete: 'cascade', 
    }).notNull(), 
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.preferenceUserId] }), 
        userIdIndex: index("ridderPreferences_userIdIndex").on(table.userId), 
        preferenceUserIdIndex: index("ridderPreferences_preferenceUserIdIndex").on(table.preferenceUserId), 
    };
});

export const RidderPreferencesRelation = relations(RidderPreferences, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderPreferences.userId], 
        references: [RidderTable.id], 
    }), 
    preferenceUser: one(PassengerTable, {
        fields: [RidderPreferences.preferenceUserId], 
        references: [PassengerTable.id], 
    }), 
}));