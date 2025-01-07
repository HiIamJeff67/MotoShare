"use strict";
exports.__esModule = true;
exports.OrderRelation = exports.OrderTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
var schema_1 = require("./schema");
var enums_1 = require("./enums");
// const orderStatusEnum = pgEnum("orderStatus", ["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]);
exports.OrderTable = pg_core_1.pgTable("order", {
    id: pg_core_1.uuid("id").primaryKey().defaultRandom(),
    passengerId: pg_core_1.uuid("passengerId").references(function () { return schema_1.PassengerTable.id; }, {
        onDelete: 'cascade'
    }).notNull(),
    ridderId: pg_core_1.uuid("ridderId").references(function () { return schema_1.RidderTable.id; }, {
        onDelete: 'cascade'
    }).notNull(),
    // should be the form of: "PurchaseOrder" + " " + `${purchaseOrderId}`
    // or "SupplyOrder" + " " + `${supplyOrderId}` (with the place to seperate the text)
    // and in api layer, we use split to decode this field
    prevOrderId: pg_core_1.text("prevOrderId").notNull(),
    finalPrice: pg_core_1.integer("finalPrice").notNull(),
    passengerDescription: pg_core_1.text("passengerDescription"),
    ridderDescription: pg_core_1.text("ridderDescription"),
    finalStartCord: pg_core_1.geometry("finalStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalEndCord: pg_core_1.geometry("finalEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalStartAddress: pg_core_1.text("finalStartAddress").notNull(),
    finalEndAddress: pg_core_1.text("finalEndAddress").notNull(),
    startAfter: pg_core_1.timestamp("startAfter").notNull(),
    endedAt: pg_core_1.timestamp("endedAt").notNull(),
    passengerStatus: enums_1.passengerOrderStatusEnum().notNull()["default"]("UNSTARTED"),
    ridderStatus: enums_1.ridderOrderStatusEnum().notNull()["default"]("UNSTARTED"),
    createdAt: pg_core_1.timestamp("createdAt").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updatedAt").notNull().defaultNow()
}, function (table) {
    return {
        passengerIdIndex: pg_core_1.index("order_passengerIdIndex").on(table.passengerId),
        ridderIdIndex: pg_core_1.index("order_ridderIdIndex").on(table.ridderId),
        startAfterIndex: pg_core_1.index("order_startAfterIndex").on(table.startAfter.asc()),
        statusStartAfterIndex: pg_core_1.index("order_statusStartAfterIndex").on(table.passengerStatus.asc(), table.ridderStatus.asc(), table.startAfter.asc()),
        updatedAtIndex: pg_core_1.index("order_updatedAtIndex").on(table.updatedAt.desc())
    };
});
exports.OrderRelation = drizzle_orm_1.relations(exports.OrderTable, function (_a) {
    var one = _a.one;
    return ({
        passenger: one(schema_1.PassengerTable, {
            fields: [exports.OrderTable.passengerId],
            references: [schema_1.PassengerTable.id]
        }),
        ridder: one(schema_1.RidderTable, {
            fields: [exports.OrderTable.ridderId],
            references: [schema_1.RidderTable.id]
        })
    });
});
