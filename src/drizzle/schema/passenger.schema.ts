import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    PassengerInfoTable, 
    PurchaseOrderTable,
    OrderTable,
    HistoryTable,
    PassengerCollectionsToOrders,
    PassengerInviteTable,
} from "./schema";

export const PassengerTable = pgTable("passenger", {
    id: uuid("id").primaryKey().defaultRandom(),
    userName: text("userName").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});

export const PassengerRelation = relations(PassengerTable, ({ one, many }) => ({
    info: one(PassengerInfoTable),  // no need to specify the relation to info, since fk is not here
    collection: many(PassengerCollectionsToOrders),
    purchaseOrders: many(PurchaseOrderTable),
    orders: many(OrderTable),
    historyOrders: many(HistoryTable),
    invite: many(PassengerInviteTable),
}));
