"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderCollectionsToOrdersRelation = exports.RidderCollectionRelation = exports.RidderCollectionsToOrders = exports.RidderCollectionTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const ridder_schema_1 = require("./ridder.schema");
const purchaseOrder_schema_1 = require("./purchaseOrder.schema");
exports.RidderCollectionTable = (0, pg_core_1.pgTable)("ridderCollection", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
});
exports.RidderCollectionsToOrders = (0, pg_core_1.pgTable)("ridderCollectionsToOrders", {
    collectionId: (0, pg_core_1.uuid)("collectionId").references(() => exports.RidderCollectionTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: (0, pg_core_1.uuid)("orderId").references(() => purchaseOrder_schema_1.PurchaseOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.collectionId, table.orderId] })
    };
});
exports.RidderCollectionRelation = (0, drizzle_orm_1.relations)(exports.RidderCollectionTable, ({ one, many }) => ({
    user: one(ridder_schema_1.RidderTable, {
        fields: [exports.RidderCollectionTable.userId],
        references: [ridder_schema_1.RidderTable.id],
    }),
    collectionsToOrders: many(exports.RidderCollectionsToOrders),
}));
exports.RidderCollectionsToOrdersRelation = (0, drizzle_orm_1.relations)(exports.RidderCollectionsToOrders, ({ one }) => ({
    collection: one(exports.RidderCollectionTable, {
        fields: [exports.RidderCollectionsToOrders.collectionId],
        references: [exports.RidderCollectionTable.id],
    }),
    order: one(purchaseOrder_schema_1.PurchaseOrderTable, {
        fields: [exports.RidderCollectionsToOrders.orderId],
        references: [purchaseOrder_schema_1.PurchaseOrderTable.id],
    }),
}));
//# sourceMappingURL=ridderCollection.schema.js.map