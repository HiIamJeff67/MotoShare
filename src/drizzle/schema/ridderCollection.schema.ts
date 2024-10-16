import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { RidderTable } from "./ridder.schema";
import { PurchaseOrderTable } from "./purchaseOrder.schema";

export const RidderCollectionTable = pgTable("ridderCollection", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).unique(),
});

// this table is for the internal node for the many-to-many relationship between PassengerCollectionTable and SupplyOrderTable
export const RidderCollectionsToOrders = pgTable("ridderCollectionsToOrders", {
    collectionId: uuid("collectionId").references(() => RidderCollectionTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => PurchaseOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.collectionId, table.orderId] })
    };
});

export const RidderCollectionRelation = relations(RidderCollectionTable, ({ one, many }) => ({
    user: one(RidderTable, {
        fields: [RidderCollectionTable.userId],
        references: [RidderTable.id],
    }),
    collectionsToOrders: many(RidderCollectionsToOrders),
}));

export const RidderCollectionsToOrdersRelation = relations(RidderCollectionsToOrders, ({ one }) => ({
    collection: one(RidderCollectionTable, {
        fields: [RidderCollectionsToOrders.collectionId],
        references: [RidderCollectionTable.id],
    }),
    order: one(PurchaseOrderTable, {
        fields: [RidderCollectionsToOrders.orderId],
        references: [PurchaseOrderTable.id],
    }),
}));