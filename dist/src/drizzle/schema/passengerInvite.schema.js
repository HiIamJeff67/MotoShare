"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengerInviteRelation = exports.PassengerInviteTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.PassengerInviteTable = (0, pg_core_1.pgTable)('passengerInvite', {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: (0, pg_core_1.uuid)("orderId").references(() => schema_1.SupplyOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    briefDescription: (0, pg_core_1.text)("briefDesciption"),
    suggestPrice: (0, pg_core_1.integer)("suggestPrice").notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: (0, pg_core_1.text)("startAddress").notNull(),
    endAddress: (0, pg_core_1.text)("endAddress").notNull(),
    suggestStartAfter: (0, pg_core_1.timestamp)("suggestStartAfter").notNull(),
    suggestEndedAt: (0, pg_core_1.timestamp)("suggestEndedAt").notNull(),
    status: (0, enums_1.inviteStatusEnum)().notNull().default("CHECKING"),
    notificationType: (0, pg_core_1.text)("notificationType").notNull().default("INVITE"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("passengerInvite_userIdIndex").on(table.userId),
        orderIdIndex: (0, pg_core_1.index)("passengerInvite_orderIdIndex").on(table.orderId),
        startAfterIndex: (0, pg_core_1.index)("passengerInvite_startAfterIndex").on(table.suggestStartAfter.asc()),
        statusStartAfterIndex: (0, pg_core_1.index)("passengerInvite_statusStartAfterIndex").on(table.status.asc(), table.suggestStartAfter.asc()),
        updatedAtIndex: (0, pg_core_1.index)("passengerInvite_updatedAtIndex").on(table.updatedAt.desc()),
    };
});
exports.PassengerInviteRelation = (0, drizzle_orm_1.relations)(exports.PassengerInviteTable, ({ one }) => ({
    inviter: one(schema_1.PassengerTable, {
        fields: [exports.PassengerInviteTable.userId],
        references: [schema_1.PassengerTable.id],
    }),
    order: one(schema_1.SupplyOrderTable, {
        fields: [exports.PassengerInviteTable.orderId],
        references: [schema_1.SupplyOrderTable.id],
    }),
}));
//# sourceMappingURL=passengerInvite.schema.js.map