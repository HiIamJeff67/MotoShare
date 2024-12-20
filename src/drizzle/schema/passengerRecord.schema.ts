import { jsonb, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { relations, sql } from "drizzle-orm";

export const PassengerRecordTable = pgTable("passengerRecord", {
    id: uuid("id").defaultRandom(), 
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: "cascade", 
    }).unique(), 
    searchRecords: jsonb().array().notNull().default(sql`ARRAY[]::jsonb[]`), 
}, (table) => {
    return {
        userdIdIndex: uniqueIndex("passengerRecord_userIdIndex").on(table.userId), 
    };
});

export const PassengerRecordRelation = relations(PassengerRecordTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerRecordTable.userId], 
        references: [PassengerTable.id], 
    }), 
}));
