"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRelation = exports.OrderTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.OrderTable = (0, pg_core_1.pgTable)("order", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    passengerId: (0, pg_core_1.uuid)("passengerId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    ridderId: (0, pg_core_1.uuid)("ridderId").references(() => schema_1.RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    prevOrderId: (0, pg_core_1.text)("prevOrderId").notNull(),
    finalPrice: (0, pg_core_1.integer)("finalPrice").notNull(),
    passengerDescription: (0, pg_core_1.text)("passengerDescription"),
    ridderDescription: (0, pg_core_1.text)("ridderDescription"),
    finalStartCord: (0, pg_core_1.geometry)("finalStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalEndCord: (0, pg_core_1.geometry)("finalEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalStartAddress: (0, pg_core_1.text)("finalStartAddress").notNull(),
    finalEndAddress: (0, pg_core_1.text)("finalEndAddress").notNull(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull(),
    passengerStatus: (0, enums_1.passengerOrderStatusEnum)().notNull().default("UNSTARTED"),
    ridderStatus: (0, enums_1.ridderOrderStatusEnum)().notNull().default("UNSTARTED"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        passengerIdIndex: (0, pg_core_1.index)("order_passengerIdIndex").on(table.passengerId),
        ridderIdIndex: (0, pg_core_1.index)("order_ridderIdIndex").on(table.ridderId),
        startAfterIndex: (0, pg_core_1.index)("order_startAfterIndex").on(table.startAfter.asc()),
        statusStartAfterIndex: (0, pg_core_1.index)("order_statusStartAfterIndex").on(table.passengerStatus.asc(), table.ridderStatus.asc(), table.startAfter.asc()),
        updatedAtIndex: (0, pg_core_1.index)("order_updatedAtIndex").on(table.updatedAt.desc()),
    };
});
exports.OrderRelation = (0, drizzle_orm_1.relations)(exports.OrderTable, ({ one }) => ({
    passenger: one(schema_1.PassengerTable, {
        fields: [exports.OrderTable.passengerId],
        references: [schema_1.PassengerTable.id],
    }),
    ridder: one(schema_1.RidderTable, {
        fields: [exports.OrderTable.ridderId],
        references: [schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=order.schema.js.map