import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PassengerInfoTable } from "./passengerInfo.schema";
import { PurchaseOrderTable } from "./purchaseOrder.schema";
import { OrderTable } from "./order.schema";
import { HistoryTable } from "./history.schema";
import { PassengerCollectionTable } from "./passengerCollection.schema";

export const PassengerTable = pgTable("passenger", {
    id: uuid("id").primaryKey().defaultRandom(),
    userName: text("userName").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});

export const PassengerRelation = relations(PassengerTable, ({ one, many }) => ({
    info: one(PassengerInfoTable),  // no need to specify the relation to info, since fk is not here
    collection: one(PassengerCollectionTable),
    purchaseOrders: many(PurchaseOrderTable),
    orders: many(OrderTable),
    historyOrders: many(HistoryTable),
}));
