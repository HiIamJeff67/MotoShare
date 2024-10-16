import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PassengerTable } from "./passenger.schema"
import { SupplyOrderTable } from "./supplyOrder.schema";

export const PassengerCollectionTable = pgTable("passengerCollection", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).unique(),
});

// this table is for the internal node for the many-to-many relationship between PassengerCollectionTable and SupplyOrderTable
export const PassengerCollectionsToOrders = pgTable("passengerCollectionsToOrders", {
    collectionId: uuid("collectionId").references(() => PassengerCollectionTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => SupplyOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.collectionId, table.orderId] })
    };
});

export const PassengerCollectionRelation = relations(PassengerCollectionTable, ({ one, many }) => ({
    user: one(PassengerTable, {
        fields: [PassengerCollectionTable.userId],
        references: [PassengerTable.id],
    }),
    collectionsToOrders: many(PassengerCollectionsToOrders),
}));

export const PassengerCollectionsToOrdersRelation = relations(PassengerCollectionsToOrders, ({ one }) => ({
    collection: one(PassengerCollectionTable, {
        fields: [PassengerCollectionsToOrders.collectionId],
        references: [PassengerCollectionTable.id],
    }),
    order: one(SupplyOrderTable, {
        fields: [PassengerCollectionsToOrders.orderId],
        references: [SupplyOrderTable.id],
    }),
}));