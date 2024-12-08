import { boolean, doublePrecision, geometry, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { RidderTable } from "./ridder.schema";
import { daysOfWeekEnum } from "./enums";
import { relations } from "drizzle-orm";

export const PeriodicSupplyOrderTable = pgTable('periodicSupplyOrder', {
    id: uuid('id').primaryKey().defaultRandom(), 
    creatorId: uuid('creatorId').references(() => RidderTable.id, {
        onDelete: 'cascade', 
    }).notNull(), 
    initPrice: integer('initPrice').notNull(), 
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: text("startAddress").notNull(),
    endAddress: text("endAddress").notNull(),
    startAfter: timestamp("startAfter").notNull(),
    endedAt: timestamp("endedAt").notNull(),
    scheduledDay: daysOfWeekEnum().notNull(), 
    tolerableRDV: doublePrecision("tolerableRDV").notNull().default(5), 
    autoAccept: boolean().notNull().default(false), 
    createdAt: timestamp('createdAt').notNull().defaultNow(), 
    updatedAt: timestamp('updatedAt').notNull().defaultNow(), 
}, (table) => {
    return {
        creatorIdIndex: index("periodicSupplyOrder_creatorIdIndex").on(table.creatorId), 
        scheduledDayIndex: index("periodicSupplyOrder_scheduledDayIndex").on(table.scheduledDay), 
        startAfterIndex: index("periodicSupplyOrder_startAfterIndex").on(table.startAfter), 
        endedAtIndex: index("periodicSupplyOrder_endedAtIndex").on(table.endedAt), 
        updatedAtIndex: index("periodicSupplyOrder_updatedAtIndex").on(table.updatedAt), 
    };
});

export const PeriodicSupplyOrderRelation = relations(PeriodicSupplyOrderTable, ({ one }) => ({
    creator: one(RidderTable, {
        fields: [PeriodicSupplyOrderTable.creatorId], 
        references: [RidderTable.id], 
    }), 
}));
