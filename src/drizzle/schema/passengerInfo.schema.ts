import { integer, boolean, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PassengerTable } from "./schema";

export const PassengerInfoTable = pgTable("passengerInfo", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(), // one-to-one
    isOnline: boolean("isOnline").notNull().default(true),
    age: integer("age"),
    phoneNumber: text("phoneNumber").unique(),
    selfIntroduction: text("selfIntroduction"),
    avatorUrl: text("avatorUrl"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const PassengerInfoRelation = relations(PassengerInfoTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerInfoTable.userId],
        references: [PassengerTable.id],
    }),
}));
