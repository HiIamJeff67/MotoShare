import { boolean, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { relations } from "drizzle-orm";

export const PassengerAuthTable = pgTable("passengerAuth", {
    id: uuid("id").primaryKey().defaultRandom(), 
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade', 
    }).notNull().unique(), // one-to-one relationship
    isEmailAuthenticated: boolean("isEmailAuthenticated").notNull().default(false), 
    isPhoneAuthenticated: boolean("isPhoneAuthenticated").notNull().default(false), 
    authCode: text("authCode").notNull(), 
    authCodeExpiredAt: timestamp("authCodeExpiredAt").notNull(), 
}, (table) => {
    return {
        userIdIndex: uniqueIndex("passengerAuth_userIdIndex").on(table.userId), 
        authCodeIndex: index("passengerAuth_authCodeIndex").on(table.authCode), 
    };
});

export const PassengerAuthRelation = relations(PassengerAuthTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerAuthTable.userId], 
        references: [PassengerTable.id], 
    }), 
}));