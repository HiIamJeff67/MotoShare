"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyOrderRelation = exports.SupplyOrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.SupplyOrderTable = (0, pg_core_1.pgTable)("supplyOrder", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    creatorId: (0, pg_core_1.uuid)("creatorId").references(() => schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    description: (0, pg_core_1.text)("description"),
    initPrice: (0, pg_core_1.integer)("initPrice").notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: (0, pg_core_1.text)("startAddress").notNull(),
    endAddress: (0, pg_core_1.text)("endAddress").notNull(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull(),
    tolerableRDV: (0, pg_core_1.doublePrecision)("tolerableRDV").notNull().default(5),
    autoAccept: (0, pg_core_1.boolean)("autoAccept").notNull().default(false),
    status: (0, enums_1.postedStatusEnum)().notNull().default("POSTED"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        creatorIdIndex: (0, pg_core_1.index)("supplyOrder_creatorIdIndex").on(table.creatorId),
        startAfterIndex: (0, pg_core_1.index)("supplyOrder_startAfterIndex").on(table.startAfter.asc()),
        statusStartAfterIndex: (0, pg_core_1.index)("supplyOrder_statusStartAfterIndex").on(table.status.asc(), table.startAfter.asc()),
        updatedAtIndex: (0, pg_core_1.index)("supplyOrder_updatedAtIndex").on(table.updatedAt.desc()),
    };
});
exports.SupplyOrderRelation = (0, drizzle_orm_1.relations)(exports.SupplyOrderTable, ({ one, many }) => ({
    creator: one(schema_1.RidderTable, {
        fields: [exports.SupplyOrderTable.creatorId],
        references: [schema_1.RidderTable.id],
    }),
    collectionsToOrders: many(schema_1.PassengerCollectionsToOrders),
    invite: many(schema_1.PassengerInviteTable),
}));
//# sourceMappingURL=supplyOrder.schema.js.map