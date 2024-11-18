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
    prevOrderId: (0, pg_core_1.text)("prevOrderId").notNull().default(""),
    finalPrice: (0, pg_core_1.integer)("finalPrice").notNull(),
    passengerDescription: (0, pg_core_1.text)("passengerDescription"),
    ridderDescription: (0, pg_core_1.text)("ridderDescription"),
    passengerStartCord: (0, pg_core_1.geometry)("passengerStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerEndCord: (0, pg_core_1.geometry)("passengerEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    ridderStartCord: (0, pg_core_1.geometry)("ridderStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerStartAddress: (0, pg_core_1.text)("passengerStartAddress").notNull().default(""),
    passengerEndAddress: (0, pg_core_1.text)("passengerEndAddress").notNull().default(""),
    ridderStartAddress: (0, pg_core_1.text)("ridderStartAddress").notNull().default(""),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull().defaultNow(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull().defaultNow(),
    passengerStatus: (0, enums_1.passengerOrderStatusEnum)().notNull().default("UNSTARTED"),
    ridderStatus: (0, enums_1.ridderOrderStatusEnum)().notNull().default("UNSTARTED"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
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