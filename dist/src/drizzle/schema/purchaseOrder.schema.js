"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderRelation = exports.PurchaseOrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const drizzle_orm_1 = require("drizzle-orm");
const ridderCollection_schema_1 = require("./ridderCollection.schema");
const enums_1 = require("./enums");
exports.PurchaseOrderTable = (0, pg_core_1.pgTable)("purchaseOrder", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    creatorId: (0, pg_core_1.uuid)("creatorId").references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }),
    description: (0, pg_core_1.text)("description"),
    initPrice: (0, pg_core_1.integer)("initPrice").notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull().defaultNow(),
    isUrgent: (0, pg_core_1.boolean)("isUrgent").notNull().default(false),
    status: (0, enums_1.postedStatusEnum)().notNull().default("POSTED"),
});
exports.PurchaseOrderRelation = (0, drizzle_orm_1.relations)(exports.PurchaseOrderTable, ({ one, many }) => ({
    creator: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PurchaseOrderTable.creatorId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
    collectionsToOrders: many(ridderCollection_schema_1.RidderCollectionsToOrders),
}));
//# sourceMappingURL=purchaseOrder.schema.js.map