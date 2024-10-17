import { integer, boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { PassengerTable } from "./passenger.schema";
import { relations } from "drizzle-orm";

export const PassengerInfoTable = pgTable("passengerInfo", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(), // one-to-one
    isOnline: boolean("isOnline").notNull().default(false),
    age: integer("age"),
    phoneNumber: text("phoneNumber").unique(),
    selfIntroduction: text("selfIntroduction"),
    avatorUrl: text("avatorUrl"),
});

export const PassengerInfoRelation = relations(PassengerInfoTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerInfoTable.userId],
        references: [PassengerTable.id],
    }),
}));