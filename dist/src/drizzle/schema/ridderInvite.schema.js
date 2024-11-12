"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidderInviteRelation = exports.RidderInviteTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("./schema");
const enums_1 = require("./enums");
exports.RidderInviteTable = (0, pg_core_1.pgTable)('ridderInvite', {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("userId").references(() => schema_1.RidderTable.id, {
        onDelete: 'set null',
    }).notNull(),
    orderId: (0, pg_core_1.uuid)("orderId").references(() => schema_1.PurchaseOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    briefDescription: (0, pg_core_1.text)("briefDesciption"),
    suggestPrice: (0, pg_core_1.integer)("suggestPrice").notNull(),
    startCord: (0, pg_core_1.geometry)("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: (0, pg_core_1.geometry)("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    suggestStartAfter: (0, pg_core_1.timestamp)("suggestStartAfter").notNull().defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt").notNull().defaultNow(),
    status: (0, enums_1.inviteStatusEnum)().notNull().default("CHECKING"),
    notificationType: (0, pg_core_1.text)("notificationType").notNull().default("INVITE"),
});
exports.RidderInviteRelation = (0, drizzle_orm_1.relations)(exports.RidderInviteTable, ({ one }) => ({
    inviter: one(schema_1.RidderTable, {
        fields: [exports.RidderInviteTable.userId],
        references: [schema_1.RidderTable.id],
    }),
    order: one(schema_1.PurchaseOrderTable, {
        fields: [exports.RidderInviteTable.orderId],
        references: [schema_1.PurchaseOrderTable.id],
    }),
}));
//# sourceMappingURL=ridderInvite.schema.js.map