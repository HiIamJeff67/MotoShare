import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { RidderTable } from "./ridder.schema";

export const RidderAuthTable = pgTable("ridderAuth", {
    id: uuid("id").primaryKey().defaultRandom(), 
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade', 
    }).notNull().unique(), // one-to-one relationship
    isEmailAuthenticated: boolean("isEmailAuthenticated").notNull().default(false), 
    isPhoneAuthenticated: boolean("isPhoneAuthenticated").notNull().default(false), 
    authCode: text("authCode").notNull(), 
    authCodeExpiredAt: timestamp("authCodeExpiredAt").notNull(), 
});

export const RidderAuthRelation = relations(RidderAuthTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderAuthTable.userId], 
        references: [RidderTable.id], 
    }), 
}));