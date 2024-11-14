import { geometry, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderTable,
    PassengerTable,
} from "./schema";

import { orderStatusEnum } from "./enums";
// const orderStatusEnum = pgEnum("orderStatus", ["UNSTARTED", "STARTED"]);

export const OrderTable = pgTable("order", {
    id: uuid("id").primaryKey().defaultRandom(),
    passengerId: uuid("passengerId").references(() => PassengerTable.id, {
        onDelete: 'set null',
    }).notNull(),
    ridderId: uuid("ridderId").references(() => RidderTable.id, {
        onDelete: 'set null',
    }).notNull(),
    finalPrice: integer("finalPrice").notNull(),
    passengerStartCord: geometry("passengerStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    passengerEndCord: geometry("passengerEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    ridderStartCord: geometry("ridderStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    // note that there's no need to specify the end cord of ridder
    startAfter: timestamp("startAfter").notNull().defaultNow(),
    endAt: timestamp("endAt").notNull().defaultNow(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    status: orderStatusEnum().notNull().default("UNSTARTED"),
});

export const OrderRelation = relations(OrderTable, ({ one }) => ({
    passenger: one(PassengerTable, {
        fields: [OrderTable.passengerId],
        references: [PassengerTable.id],
    }),
    ridder: one(RidderTable, {
        fields: [OrderTable.ridderId],
        references: [RidderTable.id],
    }),
}));
