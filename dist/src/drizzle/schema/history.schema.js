"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryRelation = exports.HistoryTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.HistoryTable = (0, pg_core_1.pgTable)("history", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    passengerId: (0, pg_core_1.uuid)("passengerId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'set null',
    }),
    ridderId: (0, pg_core_1.uuid)("ridderId").references(() => schema_1.RidderTable.id, {
        onDelete: 'set null',
    }),
    finalPrice: (0, pg_core_1.integer)("finalPrice").notNull(),
    passengerStartCord: (0, pg_core_1.geometry)("passengerStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerEndCord: (0, pg_core_1.geometry)("passengerEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    ridderStartCord: (0, pg_core_1.geometry)("ridderStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAfter: (0, pg_core_1.timestamp)("startAfter").notNull().defaultNow(),
    endedAt: (0, pg_core_1.timestamp)("endedAt").notNull().defaultNow(),
    starRatingByPassenger: (0, enums_1.starRatingEnum)().notNull().default("0"),
    starRatingByRidder: (0, enums_1.starRatingEnum)().notNull().default("0"),
    commentByPassenger: (0, pg_core_1.text)("commentByP"),
    commentByRidder: (0, pg_core_1.text)("commentByR"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    status: (0, enums_1.historyStatusEnum)().notNull().default("FINISHED"),
});
exports.HistoryRelation = (0, drizzle_orm_1.relations)(exports.HistoryTable, ({ one }) => ({
    passenger: one(schema_1.PassengerTable, {
        fields: [exports.HistoryTable.passengerId],
        references: [schema_1.PassengerTable.id],
    }),
    ridder: one(schema_1.RidderTable, {
        fields: [exports.HistoryTable.passengerId],
        references: [schema_1.RidderTable.id],
    }),
}));
//# sourceMappingURL=history.schema.js.map