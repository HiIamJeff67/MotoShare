"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerCollectionsToOrdersRelation = exports.PassengerCollectionRelation = exports.PassengerCollectionsToOrders = exports.PassengerCollectionTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const passenger_schema_1 = require("./passenger.schema");
const supplyOrder_schema_1 = require("./supplyOrder.schema");
exports.PassengerCollectionTable = (0, pg_core_1.pgTable)("passengerCollection", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),
});
exports.PassengerCollectionsToOrders = (0, pg_core_1.pgTable)("passengerCollectionsToOrders", {
    collectionId: (0, pg_core_1.uuid)("collectionId").references(() => exports.PassengerCollectionTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: (0, pg_core_1.uuid)("orderId").references(() => supplyOrder_schema_1.SupplyOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.collectionId, table.orderId] })
    };
});
exports.PassengerCollectionRelation = (0, drizzle_orm_1.relations)(exports.PassengerCollectionTable, ({ one, many }) => ({
    user: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PassengerCollectionTable.userId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
    collectionsToOrders: many(exports.PassengerCollectionsToOrders),
}));
exports.PassengerCollectionsToOrdersRelation = (0, drizzle_orm_1.relations)(exports.PassengerCollectionsToOrders, ({ one }) => ({
    collection: one(exports.PassengerCollectionTable, {
        fields: [exports.PassengerCollectionsToOrders.collectionId],
        references: [exports.PassengerCollectionTable.id],
    }),
    order: one(supplyOrder_schema_1.SupplyOrderTable, {
        fields: [exports.PassengerCollectionsToOrders.orderId],
        references: [supplyOrder_schema_1.SupplyOrderTable.id],
    }),
}));
//# sourceMappingURL=passengerCollection.schema.js.map