"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderRelation = exports.PurchaseOrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.PurchaseOrderTable = (0, pg_core_1.pgTable)("purchaseOrder", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    creatorId: (0, pg_core_1.uuid)("creatorId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    description: (0, pg_core_1.text)("description"),
    initPrice: (0, pg_core_1.integer)("initPrice").notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: (0, pg_core_1.text)("startAddress").notNull().default(""),
    endAddress: (0, pg_core_1.text)("endAddress").notNull().default(""),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull().defaultNow(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull().defaultNow(),
    isUrgent: (0, pg_core_1.boolean)("isUrgent").notNull().default(false),
    status: (0, enums_1.postedStatusEnum)().notNull().default("POSTED"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        idIndex: (0, pg_core_1.uniqueIndex)("idIndex").on(table.id),
        creatorIdIndex: (0, pg_core_1.index)("creatorIdIndex").on(table.creatorId),
        statusStartAfterIndex: (0, pg_core_1.index)("statusStartAfterIndex").on(table.startAfter, table.status),
        startCordIndex: (0, pg_core_1.index)("startCordIndex").on(table.startCord),
        endCordIndex: (0, pg_core_1.index)("endCordIndex").on(table.endCord),
        startCordEndCordIndex: (0, pg_core_1.index)("startCordEndCordIndex").on(table.startCord, table.endCord),
        updatedAtIndex: (0, pg_core_1.index)("updatedAtIndex").on(table.updatedAt),
    };
});
exports.PurchaseOrderRelation = (0, drizzle_orm_1.relations)(exports.PurchaseOrderTable, ({ one, many }) => ({
    creator: one(schema_1.PassengerTable, {
        fields: [exports.PurchaseOrderTable.creatorId],
        references: [schema_1.PassengerTable.id],
    }),
    collectionsToOrders: many(schema_1.RidderCollectionsToOrders),
    invite: many(schema_1.RidderInviteTable),
}));
//# sourceMappingURL=purchaseOrder.schema.js.map