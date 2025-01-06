import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { 
    RidderInfoTable,
    SupplyOrderTable,
    OrderTable,
    HistoryTable,
    RidderCollectionsToOrders,
    RidderInviteTable,
    RidderPreferences,
    PassengerPreferences,
    PeriodicSupplyOrderTable,
    RidderRecordTable,
    RidderBankTable,
} from "./schema";
import { RidderNotificationTable } from "./ridderNotification.schema";

export const RidderTable = pgTable("ridder", {
    id: uuid("id").primaryKey().defaultRandom(), 
    userName: text("userName").notNull().unique(), 
    email: text("email").notNull().unique(), 
    password: text("password").notNull(), 
    accessToken: text("accessToken").notNull(), 
}, (table) => {
    return {
        userNameIndex: uniqueIndex("ridder_userNameIndex").on(table.userName), 
        emailIndex: uniqueIndex("ridder_emailIndex").on(table.email), 
    };
});

export const RidderRelation = relations(RidderTable, ({ one, many }) => ({
    info: one(RidderInfoTable), // no need to specify this, since the fk is on info schema
    collection: many(RidderCollectionsToOrders), 
    supplyOrder: many(SupplyOrderTable), 
    order: many(OrderTable), 
    history: many(HistoryTable), 
    invite: many(RidderInviteTable), 
    notification: many(RidderNotificationTable), 
    preferences: many(RidderPreferences), 
    preferencedBy: many(PassengerPreferences), 
    periodicSupplyOrders: many(PeriodicSupplyOrderTable), 
    record: one(RidderRecordTable), 
    bank: one(RidderBankTable), 
}));
