import { integer, pgTable, text, timestamp, boolean, geometry, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    PassengerTable,
    RidderCollectionsToOrders,
    RidderInviteTable,
} from "./schema";

import { postedStatusEnum } from "./enums";
// postedStatusEnum = pgEnum('postStatus', ["POSTED", "CANCEL", "EXPIRED"]); // same on purchaseOrder.schema

export const PurchaseOrderTable = pgTable("purchaseOrder", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creatorId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }),
    description: text("description"),
    initPrice: integer("initPrice").notNull(),
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAfter: timestamp("startAfter").notNull().defaultNow(), // expected start after
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    isUrgent: boolean("isUrgent").notNull().default(false),
    status: postedStatusEnum().notNull().default("POSTED"),
});

export const PurchaseOrderRelation = relations(PurchaseOrderTable, ({ one, many }) => ({
    creator: one(PassengerTable, {
        fields: [PurchaseOrderTable.creatorId],
        references: [PassengerTable.id],
    }),
    collectionsToOrders: many(RidderCollectionsToOrders),
    invite: many(RidderInviteTable),
}));
