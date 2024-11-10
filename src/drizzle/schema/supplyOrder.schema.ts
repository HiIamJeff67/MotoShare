import { integer, pgTable, text, timestamp, uuid, geometry, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderTable,
    PassengerCollectionsToOrders,
    PassengerInviteTable,
} from "./schema";

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
    startAfter: timestamp("startAfter").notNull().defaultNow(), // expected start after
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    tolerableRDV: doublePrecision("tolerableRDV").notNull().default(5),    // unit: kilometers(km)
    status: postedStatusEnum().notNull().default("POSTED"),
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
