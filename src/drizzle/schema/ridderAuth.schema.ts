import { boolean, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
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
    isDefaultAuthenticated: boolean("isDefaultAuthenticated").notNull().default(false), 
    googleId: uuid("googleId"), 
}, (table) => {
    return {
        userIdIndex: uniqueIndex("ridderAuth_userIdIndex").on(table.userId), 
        authCodeIndex: index("ridderAuth_authCodeIndex").on(table.authCode), 
    };
});

export const RidderAuthRelation = relations(RidderAuthTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderAuthTable.userId], 
        references: [RidderTable.id], 
    }), 
}));