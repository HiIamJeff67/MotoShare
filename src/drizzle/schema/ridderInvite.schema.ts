import { geometry, integer, pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PurchaseOrderTable, RidderTable } from "./schema";

import { inviteStatusEnum } from "./enums";
// inviteStatusEnum = pgEnum("inviteStatus", ["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"]);

export const RidderInviteTable = pgTable('ridderInvite', {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => PurchaseOrderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    briefDescription: text("briefDesciption"),
    suggestPrice: integer("suggestPrice").notNull(),
    startCord: geometry("startCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    endCord: geometry("endCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAddress: text("startAddress").notNull(),
    endAddress: text("endAddress").notNull(),
    suggestStartAfter: timestamp("suggestStartAfter").notNull(),
    suggestEndedAt: timestamp("suggestEndedAt").notNull(),
    status: inviteStatusEnum().notNull().default("CHECKING"),
    // we don't specify the enums of notificationType, since we may extend the types of notification in the future
    notificationType: text("notificationType").notNull().default("INVITE"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: index("ridderInvite_userIdIndex").on(table.userId), 
        orderIdIndex: index("ridderInvite_orderIdIndex").on(table.orderId), 
        startAfterIndex: index("ridderInvite_startAfterIndex").on(table.suggestStartAfter.asc()), 
        statusStartAfterIndex: index("ridderInvite_statusStartAfterIndex").on(table.status.asc(), table.suggestStartAfter.asc()), 
        updateAtIndex: index("ridderInvite_updatedAtIndex").on(table.updatedAt.desc()), 
    };
});

export const RidderInviteRelation = relations(RidderInviteTable, ({ one }) => ({
    inviter: one(RidderTable, {
        fields: [RidderInviteTable.userId],
        references: [RidderTable.id],
    }),
    order: one(PurchaseOrderTable, {
        fields: [RidderInviteTable.orderId],
        references: [PurchaseOrderTable.id],
    }),
}));
