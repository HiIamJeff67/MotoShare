"use strict";
exports.__esModule = true;
exports.RidderBankRelation = exports.RidderBankTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var ridder_schema_1 = require("./ridder.schema");
var drizzle_orm_1 = require("drizzle-orm");
exports.RidderBankTable = pg_core_1.pgTable("ridderBank", {
    customerId: pg_core_1.text("customerId").primaryKey(),
    userId: pg_core_1.uuid("userId").references(function () { return ridder_schema_1.RidderTable.id; }, {
        onDelete: 'cascade'
    }).notNull().unique(),
    balance: pg_core_1.doublePrecision("balance").notNull()["default"](0),
    createdAt: pg_core_1.timestamp("createdAt").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updatedAt").notNull().defaultNow()
}, function (table) {
    return {
        userIdIndex: pg_core_1.uniqueIndex("ridderBank_userIdIndex").on(table.userId),
        updatedAtIndex: pg_core_1.index("ridderBank_updatedAtIndex").on(table.updatedAt)
    };
});
exports.RidderBankRelation = drizzle_orm_1.relations(exports.RidderBankTable, function (_a) {
    var one = _a.one;
    return ({
        user: one(ridder_schema_1.RidderTable, {
            fields: [exports.RidderBankTable.userId],
            references: [ridder_schema_1.RidderTable.id]
        })
    });
});
