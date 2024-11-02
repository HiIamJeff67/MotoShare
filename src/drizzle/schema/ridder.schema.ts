import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { RidderInfoTable } from "./ridderInfo.schema";
import { SupplyOrderTable } from "./supplyOrder.schema";
import { OrderTable } from "./order.schema";
import { HistoryTable } from "./history.schema";
import { RidderCollectionsToOrders } from "./ridderCollection.schema";

export const RidderTable = pgTable("ridder", {
    id: uuid("id").primaryKey().defaultRandom(),
    userName: text("userName").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});

export const RidderRelation = relations(RidderTable, ({ one, many }) => ({
    info: one(RidderInfoTable), // no need to specify this, since the fk is on info schema
    collection: many(RidderCollectionsToOrders),
    supplyOrder: many(SupplyOrderTable),
    order: many(OrderTable),
    history: many(HistoryTable),
}));
