import { pgTable, uuid, primaryKey, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    PassengerTable,
    SupplyOrderTable,
} from "./schema";

// this table is for the internal node for the many-to-many relationship from the PassengerTable directly to the SupplyOrderTable
export const PassengerCollectionsToOrders = pgTable("passengerCollectionsToOrders", {
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => SupplyOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.orderId] }), 
        userIdIndex: index("passengerCollectionsToOrders_userIdIndex").on(table.userId), 
        orderIdIndex: index("passengerCollectionsToOrders_orderIdIndex").on(table.orderId), 
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
