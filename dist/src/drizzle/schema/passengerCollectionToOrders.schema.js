"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerCollectionsToOrdersRelation = exports.PassengerCollectionsToOrders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
exports.PassengerCollectionsToOrders = (0, pg_core_1.pgTable)("passengerCollectionsToOrders", {
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: (0, pg_core_1.uuid)("orderId").references(() => schema_1.SupplyOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.orderId] }),
        userIdIndex: (0, pg_core_1.index)("passengerCollectionsToOrders_userIdIndex").on(table.userId),
        orderIdIndex: (0, pg_core_1.index)("passengerCollectionsToOrders_orderIdIndex").on(table.orderId),
    };
});
exports.PassengerCollectionsToOrdersRelation = (0, drizzle_orm_1.relations)(exports.PassengerCollectionsToOrders, ({ one }) => ({
    collection: one(schema_1.PassengerTable, {
        fields: [exports.PassengerCollectionsToOrders.userId],
        references: [schema_1.PassengerTable.id],
    }),
    order: one(schema_1.SupplyOrderTable, {
        fields: [exports.PassengerCollectionsToOrders.orderId],
        references: [schema_1.SupplyOrderTable.id],
    }),
}));
//# sourceMappingURL=passengerCollectionToOrders.schema.js.map