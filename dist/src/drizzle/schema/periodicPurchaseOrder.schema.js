"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicPurchaseOrderRelation = exports.PeriodicPurchaseOrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const passenger_schema_1 = require("./passenger.schema");
const enums_1 = require("./enums");
const drizzle_orm_1 = require("drizzle-orm");
exports.PeriodicPurchaseOrderTable = (0, pg_core_1.pgTable)('periodicPurchaseOrder', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    creatorId: (0, pg_core_1.uuid)('creatorId').references(() => passenger_schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    scheduledDay: (0, enums_1.daysOfWeekEnum)().notNull(),
    initPrice: (0, pg_core_1.integer)('initPrice').notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: (0, pg_core_1.text)("startAddress").notNull(),
    endAddress: (0, pg_core_1.text)("endAddress").notNull(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull(),
    isUrgent: (0, pg_core_1.boolean)("isUrgent").notNull().default(false),
    autoAccept: (0, pg_core_1.boolean)().notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('createdAt').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updatedAt').notNull().defaultNow(),
}, (table) => {
    return {
        creatorIdIndex: (0, pg_core_1.index)("periodicPurchaseOrder_creatorIdIndex").on(table.creatorId),
        startAfterIndex: (0, pg_core_1.index)("periodicPurchaseOrder_startAfterIndex").on(table.startAfter),
        endedAtIndex: (0, pg_core_1.index)("periodicPurchaseOrder_endedAtIndex").on(table.endedAt),
        scheduledDayIndex: (0, pg_core_1.index)("periodicPurchaseOrder_scheduledDayIndex").on(table.scheduledDay),
        updatedAtIndex: (0, pg_core_1.index)("periodicPurchaseOrder_updatedAtIndex").on(table.updatedAt),
    };
});
exports.PeriodicPurchaseOrderRelation = (0, drizzle_orm_1.relations)(exports.PeriodicPurchaseOrderTable, ({ one }) => ({
    creator: one(passenger_schema_1.PassengerTable, {
        fields: [exports.PeriodicPurchaseOrderTable.creatorId],
        references: [passenger_schema_1.PassengerTable.id],
    }),
}));
//# sourceMappingURL=periodicPurchaseOrder.schema.js.map