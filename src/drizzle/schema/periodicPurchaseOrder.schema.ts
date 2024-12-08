import { boolean, geometry, index, integer, jsonb, pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { daysOfWeekEnum } from "./enums";
import { relations } from "drizzle-orm";

export const PeriodicPurchaseOrderTable = pgTable('periodicPurchaseOrder', {
    id: uuid('id').primaryKey().defaultRandom(), 
    creatorId: uuid('creatorId').references(() => PassengerTable.id, {
        onDelete: 'cascade', 
    }).notNull(), 
    scheduledDay: daysOfWeekEnum().notNull(), 
    initPrice: integer('initPrice').notNull(), 
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: text("startAddress").notNull(),
    endAddress: text("endAddress").notNull(),
    startAfter: timestamp("startAfter").notNull(),
    endedAt: timestamp("endedAt").notNull(),
    isUrgent: boolean("isUrgent").notNull().default(false),
    autoAccept: boolean().notNull().default(false), 
    createdAt: timestamp('createdAt').notNull().defaultNow(), 
    updatedAt: timestamp('updatedAt').notNull().defaultNow(), 
}, (table) => {
    return {
        creatorIdIndex: index("periodicPurchaseOrder_creatorIdIndex").on(table.creatorId), 
        startAfterIndex: index("periodicPurchaseOrder_startAfterIndex").on(table.startAfter), 
        endedAtIndex: index("periodicPurchaseOrder_endedAtIndex").on(table.endedAt), 
        scheduledDayIndex: index("periodicPurchaseOrder_scheduledDayIndex").on(table.scheduledDay), 
        updatedAtIndex: index("periodicPurchaseOrder_updatedAtIndex").on(table.updatedAt), 
    };
});

export const PeriodicPurchaseOrderRelation = relations(PeriodicPurchaseOrderTable, ({ one }) => ({
    creator: one(PassengerTable, {
        fields: [PeriodicPurchaseOrderTable.creatorId], 
        references: [PassengerTable.id], 
    }), 
}));
