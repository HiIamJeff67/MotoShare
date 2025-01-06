"use strict";
exports.__esModule = true;
exports.PassengerBankRelation = exports.PassengerBankTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var passenger_schema_1 = require("./passenger.schema");
var drizzle_orm_1 = require("drizzle-orm");
exports.PassengerBankTable = pg_core_1.pgTable("passengerBank", {
    customerId: pg_core_1.text("customerId").primaryKey(),
    userId: pg_core_1.uuid("userId").references(function () { return passenger_schema_1.PassengerTable.id; }, {
        onDelete: 'cascade'
    }).notNull().unique(),
    balance: pg_core_1.doublePrecision("balance").notNull()["default"](0),
    createdAt: pg_core_1.timestamp("createdAt").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updatedAt").notNull().defaultNow()
}, function (table) {
    return {
        userIdIndex: pg_core_1.uniqueIndex("passengerBank_userIdIndex").on(table.userId),
        updatedAtIndex: pg_core_1.index("passengerBank_updatedAtIndex").on(table.updatedAt)
    };
});
exports.PassengerBankRelation = drizzle_orm_1.relations(exports.PassengerBankTable, function (_a) {
    var one = _a.one;
    return ({
        user: one(passenger_schema_1.PassengerTable, {
            fields: [exports.PassengerBankTable.userId],
            references: [passenger_schema_1.PassengerTable.id]
        })
    });
});
