"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicSupplyOrderRelation = exports.PeriodicSupplyOrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ridder_schema_1 = require("./ridder.schema");
const enums_1 = require("./enums");
const drizzle_orm_1 = require("drizzle-orm");
exports.PeriodicSupplyOrderTable = (0, pg_core_1.pgTable)('periodicSupplyOrder', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    creatorId: (0, pg_core_1.uuid)('creatorId').references(() => ridder_schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    initPrice: (0, pg_core_1.integer)('initPrice').notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: (0, pg_core_1.text)("startAddress").notNull(),
    endAddress: (0, pg_core_1.text)("endAddress").notNull(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull(),
    scheduledDay: (0, enums_1.daysOfWeekEnum)().notNull(),
    tolerableRDV: (0, pg_core_1.doublePrecision)("tolerableRDV").notNull().default(5),
    autoAccept: (0, pg_core_1.boolean)().notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('createdAt').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updatedAt').notNull().defaultNow(),
}, (table) => {
    return {
        creatorIdIndex: (0, pg_core_1.index)("periodicSupplyOrder_creatorIdIndex").on(table.creatorId),
        scheduledDayIndex: (0, pg_core_1.index)("periodicSupplyOrder_scheduledDayIndex").on(table.scheduledDay),
        startAfterIndex: (0, pg_core_1.index)("periodicSupplyOrder_startAfterIndex").on(table.startAfter),
        endedAtIndex: (0, pg_core_1.index)("periodicSupplyOrder_endedAtIndex").on(table.endedAt),
        updatedAtIndex: (0, pg_core_1.index)("periodicSupplyOrder_updatedAtIndex").on(table.updatedAt),
    };
});
exports.PeriodicSupplyOrderRelation = (0, drizzle_orm_1.relations)(exports.PeriodicSupplyOrderTable, ({ one }) => ({
    creator: one(ridder_schema_1.RidderTable, {
        fields: [exports.PeriodicSupplyOrderTable.creatorId],
        references: [ridder_schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=periodicSupplyOrder.schema.js.map