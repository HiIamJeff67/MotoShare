import { integer, pgTable, text, timestamp, uuid, geometry, doublePrecision, index, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderTable,
    PassengerCollectionsToOrders,
    PassengerInviteTable,
} from "./schema";

import { postedStatusEnum } from "./enums";
// postedStatusEnum = pgEnum('postStatus', ["POSTED", "CANCEL", "EXPIRED", "RESERVED"]); // same on purchaseOrder.schema

export const SupplyOrderTable = pgTable("supplyOrder", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creatorId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    description: text("description"),
    initPrice: integer("initPrice").notNull(),
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326  }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: text("startAddress").notNull(),
    endAddress: text("endAddress").notNull(),
    startAfter: timestamp("startAfter").notNull(),
    endedAt: timestamp("endedAt").notNull(),
    tolerableRDV: doublePrecision("tolerableRDV").notNull().default(5),    // unit: kilometers(km)
    autoAccept: boolean("autoAccept").notNull().default(false),
    status: postedStatusEnum().notNull().default("POSTED"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        creatorIdIndex: index("supplyOrder_creatorIdIndex").on(table.creatorId), 
        startAfterIndex: index("supplyOrder_startAfterIndex").on(table.startAfter.asc()), 
        statusStartAfterIndex: index("supplyOrder_statusStartAfterIndex").on(table.status.asc(), table.startAfter.asc()),
        updatedAtIndex: index("supplyOrder_updatedAtIndex").on(table.updatedAt.desc()),
    }
});
// consider to use a index on startCord and endCord to optimize the query

export const SupplyOrderRelation = relations(SupplyOrderTable, ({ one, many }) => ({
    creator: one(RidderTable, {
        fields: [SupplyOrderTable.creatorId],
        references: [RidderTable.id],
    }),
    collectionsToOrders: many(PassengerCollectionsToOrders),
    invite: many(PassengerInviteTable),
}));
