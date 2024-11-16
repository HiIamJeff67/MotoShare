import { geometry, integer, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
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
    startAddress: text("startAddress").notNull().default(""),
    endAddress: text("endAddress").notNull().default(""),
    suggestStartAfter: timestamp("suggestStartAfter").notNull().defaultNow(),
    suggestEndedAt: timestamp("suggestEndedAt").notNull().defaultNow(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    status: inviteStatusEnum().notNull().default("CHECKING"),
    // we don't specify the enums of notificationType, since we may extend the types of notification in the future
    notificationType: text("notificationType").notNull().default("INVITE"),
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
