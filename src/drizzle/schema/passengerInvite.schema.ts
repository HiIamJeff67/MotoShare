import { geometry, integer, pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PassengerTable, SupplyOrderTable } from "./schema";

import { inviteStatusEnum } from "./enums";
// inviteStatusEnum = pgEnum("inviteStatus", ["ACCEPTED", "REJECTED", "CHECKING", "CANCEL"]);

export const PassengerInviteTable = pgTable('passengerInvite', {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    orderId: uuid("orderId").references(() => SupplyOrderTable.id, {
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
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: index("passengerInvite_userIdIndex").on(table.userId), 
        orderIdIndex: index("passengerInvite_orderIdIndex").on(table.orderId), 
        startAfterIndex: index("passengerInvite_startAfterIndex").on(table.suggestStartAfter.asc()), 
        statusStartAfterIndex: index("passengerInvite_statusStartAfterIndex").on(table.status.asc(), table.suggestStartAfter.asc()), 
        updatedAtIndex: index("passengerInvite_updatedAtIndex").on(table.updatedAt.desc()), 
    };
});

export const PassengerInviteRelation = relations(PassengerInviteTable, ({ one }) => ({
    inviter: one(PassengerTable, {
        fields: [PassengerInviteTable.userId],
        references: [PassengerTable.id],
    }),
    order: one(SupplyOrderTable, {
        fields: [PassengerInviteTable.orderId],
        references: [SupplyOrderTable.id],
    }),
}));
