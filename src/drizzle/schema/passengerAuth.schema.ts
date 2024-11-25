import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
});

export const PassengerAuthRelation = relations(PassengerAuthTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerAuthTable.userId], 
        references: [PassengerTable.id], 
    }), 
}));