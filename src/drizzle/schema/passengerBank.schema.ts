import { doublePrecision, index, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { relations } from "drizzle-orm";

export const PassengerBankTable = pgTable("passengerBank", {
    customerId: uuid("customerId").primaryKey(), // WITHOUT default value
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade', 
    }).notNull().unique(), 
    balance: doublePrecision("balance").notNull().default(0), 
    createdAt: timestamp("createdAt").notNull().defaultNow(), 
    updatedAt: timestamp("updatedAt").notNull().defaultNow(), 
}, (table) => {
    return {
        userIdIndex: uniqueIndex("passengerBank_userIdIndex").on(table.userId), 
        updatedAtIndex: index("passengerBank_updatedAtIndex").on(table.updatedAt), 
    };
});

export const PassengerBankRelation = relations(PassengerBankTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerBankTable.userId], 
        references: [PassengerTable.id], 
    }), 
}));