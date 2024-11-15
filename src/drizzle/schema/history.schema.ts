import { geometry, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderTable,
    PassengerTable,
} from "./schema";

import { historyStatusEnum, starRatingEnum } from "./enums";
// const historyStatusEnum = pgEnum("historyStatus", ["FINISHED", "EXPIRED", "CANCEL"])
// const starRatingEnum = pgEnum("starRating", ["0", "1", "2", "3", "4", "5"])

export const HistoryTable = pgTable("history", {
    id: uuid("id").primaryKey().defaultRandom(),
    passengerId: uuid("passengerId").references(() => PassengerTable.id, {
        onDelete: 'set null',
    }),
    ridderId: uuid("ridderId").references(() => RidderTable.id, {
        onDelete: 'set null',
    }),
    // should be the form of: "PurchaseOrder" + " " + `${purchaseOrderId}`
    // or "SupplyOrder" + " " + `${supplyOrderId}` (with the place to seperate the text)
    // and in api layer, we use split to decode this field
    prevOrderId: text("prevOrderId").notNull().default(""), 
    finalPrice: integer("finalPrice").notNull(),
    passengerStartCord: geometry("passengerStartCord",  { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerEndCord: geometry("passengerEndCord",  { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    ridderStartCord: geometry("ridderStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerStartAddress: text("passengerStartAddress").notNull().default(""),
    passengerEndAddress: text("passengerEndAddress").notNull().default(""),
    ridderStartAddress: text("ridderStartAddress").notNull().default(""),
    startAfter: timestamp("startAfter").notNull().defaultNow(),
    endedAt: timestamp("endedAt").notNull().defaultNow(),
    starRatingByPassenger: starRatingEnum().notNull().default("0"),
    starRatingByRidder: starRatingEnum().notNull().default("0"),
    commentByPassenger: text("commentByP"),
    commentByRidder: text("commentByR"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("udpatedAt").notNull().defaultNow(),
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
