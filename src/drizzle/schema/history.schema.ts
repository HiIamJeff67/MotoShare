import { geometry, integer, pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
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
    prevOrderId: text("prevOrderId").notNull(), 
    finalPrice: integer("finalPrice").notNull(),
    passengerDescription: text("passengerDescription"),
    ridderDescription: text("ridderDescription"),
    finalStartCord: geometry("finalStartCord",  { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalEndCord: geometry("finalEndCord",  { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalStartAddress: text("finalStartAddress").notNull(),
    finalEndAddress: text("finalEndAddress").notNull(),
    startAfter: timestamp("startAfter").notNull(),
    endedAt: timestamp("endedAt").notNull(),
    starRatingByPassenger: starRatingEnum().notNull().default("0"),
    starRatingByRidder: starRatingEnum().notNull().default("0"),
    commentByPassenger: text("commentByP"),
    commentByRidder: text("commentByR"),
    status: historyStatusEnum().notNull().default("FINISHED"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("udpatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        passengerIdIndex: index("history_passengerIdIndex").on(table.passengerId), 
        ridderIdIndex: index("history_ridderIdIndex").on(table.ridderId), 
        updatedAtIndex: index("history_updatedAtIndex").on(table.updatedAt.desc()), 
    };
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
