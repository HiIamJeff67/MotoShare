import { pgTable, uuid, primaryKey, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderTable,
    PurchaseOrderTable,
} from "./schema";

// this table is for the internal node for the many-to-many relationship from the RidderTable directly to the PurchaseOrderTable
export const RidderCollectionsToOrders = pgTable("ridderCollectionsToOrders", {
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => PurchaseOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.orderId] }), 
        userIdIndex: index("ridderCollectionsToOrders_userIdIndex").on(table.userId), 
        orderIdIndex: index("ridderCollectionsToOrders_orderIdIndex").on(table.orderId), 
    };
});

export const RidderCollectionsToOrdersRelation = relations(RidderCollectionsToOrders, ({ one }) => ({
    collection: one(RidderTable, {
        fields: [RidderCollectionsToOrders.userId],
        references: [RidderTable.id],
    }),
    order: one(PurchaseOrderTable, {
        fields: [RidderCollectionsToOrders.orderId],
        references: [PurchaseOrderTable.id],
    }),
}));