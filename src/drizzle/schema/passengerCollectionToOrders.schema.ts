import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PassengerTable } from "./passenger.schema";
import { SupplyOrderTable } from "./supplyOrder.schema";


// this table is for the internal node for the many-to-many relationship between PassengerCollectionTable and SupplyOrderTable
export const PassengerCollectionsToOrders = pgTable("passengerCollectionsToOrders", {
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => SupplyOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.orderId] })
    };
});

export const PassengerCollectionsToOrdersRelation = relations(PassengerCollectionsToOrders, ({ one }) => ({
    collection: one(PassengerTable, {
        fields: [PassengerCollectionsToOrders.userId],
        references: [PassengerTable.id],
    }),
    order: one(SupplyOrderTable, {
        fields: [PassengerCollectionsToOrders.orderId],
        references: [SupplyOrderTable.id],
    }),
}));
