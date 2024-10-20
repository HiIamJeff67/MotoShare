"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyOrderRelation = exports.SupplyOrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ridder_schema_1 = require("./ridder.schema");
const drizzle_orm_1 = require("drizzle-orm");
const passengerCollection_schema_1 = require("./passengerCollection.schema");
const enums_1 = require("./enums");
exports.SupplyOrderTable = (0, pg_core_1.pgTable)("supplyOrder", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    creatorId: (0, pg_core_1.uuid)("creatorId").references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }),
    description: (0, pg_core_1.text)("description"),
    initPrice: (0, pg_core_1.integer)("initPrice").notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull().defaultNow(),
    status: (0, enums_1.postedStatusEnum)().notNull().default("POSTED"),
});
exports.SupplyOrderRelation = (0, drizzle_orm_1.relations)(exports.SupplyOrderTable, ({ one, many }) => ({
    creator: one(ridder_schema_1.RidderTable, {
        fields: [exports.SupplyOrderTable.creatorId],
        references: [ridder_schema_1.RidderTable.id],
    }),
    collectionsToOrders: many(passengerCollection_schema_1.PassengerCollectionsToOrders),
}));
//# sourceMappingURL=supplyOrder.schema.js.map