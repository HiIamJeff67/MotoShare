import { geometry, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderTable,
    PassengerTable,
} from "./schema";

import { passengerOrderStatusEnum, ridderOrderStatusEnum } from "./enums";
// const orderStatusEnum = pgEnum("orderStatus", ["UNSTARTED", "STARTED", "UNPAID", "FINISHED"]);

export const OrderTable = pgTable("order", {
    id: uuid("id").primaryKey().defaultRandom(),
    passengerId: uuid("passengerId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    ridderId: uuid("ridderId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).notNull(),
    // should be the form of: "PurchaseOrder" + " " + `${purchaseOrderId}`
    // or "SupplyOrder" + " " + `${supplyOrderId}` (with the place to seperate the text)
    // and in api layer, we use split to decode this field
    prevOrderId: text("prevOrderId").notNull(),
    finalPrice: integer("finalPrice").notNull(),
    passengerDescription: text("passengerDescription"),
    ridderDescription: text("ridderDescription"),
    finalStartCord: geometry("finalStartCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalEndCord: geometry("finalEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    // ridderEndCord: geometry("ridderEndCord", { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    finalStartAddress: text("finalStartAddress").notNull(),
    finalEndAddress: text("finalEndAddress").notNull(),
    // ridderEndAddress: text("ridderEndAddress").notNull().default(""),
    // note that there's no need to specify the end cord of ridder
    startAfter: timestamp("startAfter").notNull(),
    endedAt: timestamp("endedAt").notNull(),
    passengerStatus: passengerOrderStatusEnum().notNull().default("UNSTARTED"),
    ridderStatus: ridderOrderStatusEnum().notNull().default("UNSTARTED"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        passengerIdIndex: index("order_passengerIdIndex").on(table.passengerId), 
        ridderIdIndex: index("order_ridderIdIndex").on(table.ridderId), 
        startAfterIndex: index("order_startAfterIndex").on(table.startAfter.asc()), 
        statusStartAfterIndex: index("order_statusStartAfterIndex").on(table.passengerStatus.asc(), table.ridderStatus.asc(), table.startAfter.asc()), 
        updatedAtIndex: index("order_updatedAtIndex").on(table.updatedAt.desc()), 
    };
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
