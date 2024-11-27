import { integer, pgTable, text, timestamp, boolean, geometry, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    PassengerTable,
    RidderCollectionsToOrders,
    RidderInviteTable,
} from "./schema";

import { postedStatusEnum } from "./enums";
// postedStatusEnum = pgEnum('postStatus', ["POSTED", "CANCEL", "EXPIRED", "RESERVED"]); // same on purchaseOrder.schema

export const PurchaseOrderTable = pgTable("purchaseOrder", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creatorId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    description: text("description"),
    initPrice: integer("initPrice").notNull(),
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: text("startAddress").notNull(),
    endAddress: text("endAddress").notNull(),
    startAfter: timestamp("startAfter").notNull(),
    endedAt: timestamp("endedAt").notNull(),
    isUrgent: boolean("isUrgent").notNull().default(false),
    autoAccept: boolean("autoAccept").notNull().default(false),
    status: postedStatusEnum().notNull().default("POSTED"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        creatorIdIndex: index("purchaseOrder_creatorIdIndex").on(table.creatorId), 
        startAfterIndex: index("puchaseOrder_startAfterIndex").on(table.startAfter.asc()), 
        statusStartAfterIndex: index("purchaseOrder_statusStartAfterIndex").on(table.status.asc(), table.startAfter.asc()), 
        updatedAtIndex: index("purchaseOrder_updatedAtIndex").on(table.updatedAt.desc()), 
    };
});

export const PurchaseOrderRelation = relations(PurchaseOrderTable, ({ one, many }) => ({
    creator: one(PassengerTable, {
        fields: [PurchaseOrderTable.creatorId],
        references: [PassengerTable.id],
    }),
    collectionsToOrders: many(RidderCollectionsToOrders),
    invite: many(RidderInviteTable),
}));
