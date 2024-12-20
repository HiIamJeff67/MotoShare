import { jsonb, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { RidderTable } from "./schema";
import { relations, sql } from "drizzle-orm";

export const RidderRecordTable = pgTable("ridderRecord", {
    id: uuid("id").defaultRandom(), 
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: "cascade", 
    }).unique(), 
    searchRecords: jsonb().array().notNull().default(sql`ARRAY[]::jsonb[]`), 
}, (table) => {
    return {
        userdIdIndex: uniqueIndex("ridderRecord_userIdIndex").on(table.userId), 
    };
});

export const RidderRecordRelation = relations(RidderRecordTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderRecordTable.userId], 
        references: [RidderTable.id], 
    }), 
}));
