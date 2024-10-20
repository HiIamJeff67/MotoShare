import { integer, pgTable, text, timestamp, uuid, geometry, pgEnum } from "drizzle-orm/pg-core";
import { RidderTable } from "./ridder.schema";
import { relations } from "drizzle-orm";

import { PassengerCollectionsToOrders } from "./passengerCollection.schema";

import { postedStatusEnum } from "./enums";
// postedStatusEnum = pgEnum('postStatus', ["POSTED", "CANCEL", "EXPIRED"]); // same on purchaseOrder.schema

export const SupplyOrderTable = pgTable("supplyOrder", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creatorId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }),
    description: text("description"),
    initPrice: integer("initPrice").notNull(),
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326  }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    startAfter: timestamp("startAfter").notNull().defaultNow(), // expected start after
    status: postedStatusEnum().notNull().default("POSTED"),
});

export const SupplyOrderRelation = relations(SupplyOrderTable, ({ one, many }) => ({
    creator: one(RidderTable, {
        fields: [SupplyOrderTable.creatorId],
        references: [RidderTable.id],
    }),
    collectionsToOrders: many(PassengerCollectionsToOrders),
}));
