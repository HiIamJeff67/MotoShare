import { geometry, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { RidderTable } from "./ridder.schema";
import { PassengerTable } from "./passenger.schema";
import { relations } from "drizzle-orm";

import { historyStatusEnum, starRatingEnum } from "./enums";
// const historyStatusEnum = pgEnum("historyStatus", ["FINISHED", "EXPIRED", "CANCEL"])
// const starRatingEnum = pgEnum("starRating", ["0", "1", "2", "3", "4", "5"])

export const HistoryTable = pgTable("history", {
    id: uuid("id").primaryKey(),
    passengerId: uuid("passengerId").references(() => PassengerTable.id, {
        onDelete: 'set null',
    }),
    ridderId: uuid("ridderId").references(() => RidderTable.id, {
        onDelete: 'set null',
    }),
    finalPrice: integer("finalPrice").notNull(),
    passengerStartCord: geometry("passengerStartCord",  { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerEndCord: geometry("passengerEndCord",  { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    ridderStartCord: geometry("ridderStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    startAfter: timestamp("startAfter").notNull().defaultNow(),
    endedAt: timestamp("endedAt").notNull().defaultNow(),
    starRatingByPassenger: starRatingEnum().notNull().default("0"),
    starRatingByRidder: starRatingEnum().notNull().default("0"),
    commentByPassenger: text("commentByP"),
    commentByRidder: text("commentByR"),
    status: historyStatusEnum().notNull().default("FINISHED"),
});

export const HistoryRelation = relations(HistoryTable, ({ one }) => ({
    passenger: one(PassengerTable, {
        fields: [HistoryTable.passengerId],
        references: [PassengerTable.id],
    }),
    ridder: one(RidderTable, {
        fields: [HistoryTable.passengerId],
        references: [RidderTable.id],
    }),
}));
