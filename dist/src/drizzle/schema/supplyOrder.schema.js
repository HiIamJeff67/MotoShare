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
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull().defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
    tolerableRDV: (0, pg_core_1.doublePrecision)("tolerableRDV").notNull().default(5),
    status: (0, enums_1.postedStatusEnum)().notNull().default("POSTED"),
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