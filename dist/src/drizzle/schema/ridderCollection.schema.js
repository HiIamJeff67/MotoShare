"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderCollectionsToOrdersRelation = exports.RidderCollectionsToOrders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
exports.RidderCollectionsToOrders = (0, pg_core_1.pgTable)("ridderCollectionsToOrders", {
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: (0, pg_core_1.uuid)("orderId").references(() => schema_1.PurchaseOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.orderId] })
    };
});
exports.RidderCollectionsToOrdersRelation = (0, drizzle_orm_1.relations)(exports.RidderCollectionsToOrders, ({ one }) => ({
    collection: one(schema_1.RidderTable, {
        fields: [exports.RidderCollectionsToOrders.userId],
        references: [schema_1.RidderTable.id],
    }),
    order: one(schema_1.PurchaseOrderTable, {
        fields: [exports.RidderCollectionsToOrders.orderId],
        references: [schema_1.PurchaseOrderTable.id],
    }),
}));
//# sourceMappingURL=ridderCollection.schema.js.map