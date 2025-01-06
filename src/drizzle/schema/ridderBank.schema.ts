import { doublePrecision, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { RidderTable } from "./ridder.schema";
import { relations } from "drizzle-orm";

export const RidderBankTable = pgTable("ridderBank", {
    customerId: text("customerId").primaryKey(), // WITHOUT default value
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade', 
    }).notNull().unique(), 
    balance: doublePrecision("balance").notNull().default(0), 
    createdAt: timestamp("createdAt").notNull().defaultNow(), 
    updatedAt: timestamp("updatedAt").notNull().defaultNow(), 
}, (table) => {
    return {
        userIdIndex: uniqueIndex("ridderBank_userIdIndex").on(table.userId), 
        updatedAtIndex: index("ridderBank_updatedAtIndex").on(table.updatedAt), 
    };
});

export const RidderBankRelation = relations(RidderBankTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderBankTable.userId], 
        references: [RidderTable.id], 
    }), 
}));