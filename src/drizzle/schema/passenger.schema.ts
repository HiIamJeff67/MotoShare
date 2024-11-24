import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
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
    accessToken: text("accessToken").notNull().unique(), 
}, (table) => {
    return {
        userNameIndex: uniqueIndex("passenger_userNameIndex").on(table.userName), // for searching user by name
        emailIndex: uniqueIndex("passenger_emailIndex").on(table.email), // for validating if there's a such user with the given email while logging in
    };
});

export const PassengerRelation = relations(PassengerTable, ({ one, many }) => ({
    info: one(PassengerInfoTable),  // no need to specify the relation to info, since fk is not here
    collection: many(PassengerCollectionsToOrders),
    purchaseOrders: many(PurchaseOrderTable),
    orders: many(OrderTable),
    historyOrders: many(HistoryTable),
    invite: many(PassengerInviteTable),
}));
