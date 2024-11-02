"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderRelation = exports.RidderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const ridderInfo_schema_1 = require("./ridderInfo.schema");
const supplyOrder_schema_1 = require("./supplyOrder.schema");
const order_schema_1 = require("./order.schema");
const history_schema_1 = require("./history.schema");
const ridderCollection_schema_1 = require("./ridderCollection.schema");
exports.RidderTable = (0, pg_core_1.pgTable)("ridder", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userName: (0, pg_core_1.text)("userName").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.RidderRelation = (0, drizzle_orm_1.relations)(exports.RidderTable, ({ one, many }) => ({
    info: one(ridderInfo_schema_1.RidderInfoTable),
    collection: many(ridderCollection_schema_1.RidderCollectionsToOrders),
    supplyOrder: many(supplyOrder_schema_1.SupplyOrderTable),
    order: many(order_schema_1.OrderTable),
    history: many(history_schema_1.HistoryTable),
}));
//# sourceMappingURL=ridder.schema.js.map