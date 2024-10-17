"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerRelation = exports.PassengerTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const passengerInfo_schema_1 = require("./passengerInfo.schema");
const purchaseOrder_schema_1 = require("./purchaseOrder.schema");
const order_schema_1 = require("./order.schema");
const history_schema_1 = require("./history.schema");
const passengerCollection_schema_1 = require("./passengerCollection.schema");
exports.PassengerTable = (0, pg_core_1.pgTable)("passenger", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userName: (0, pg_core_1.text)("userName").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.PassengerRelation = (0, drizzle_orm_1.relations)(exports.PassengerTable, ({ one, many }) => ({
    info: one(passengerInfo_schema_1.PassengerInfoTable),
    collection: one(passengerCollection_schema_1.PassengerCollectionTable),
    purchaseOrders: many(purchaseOrder_schema_1.PurchaseOrderTable),
    orders: many(order_schema_1.OrderTable),
    historyOrders: many(history_schema_1.HistoryTable),
}));
//# sourceMappingURL=passenger.schema.js.map