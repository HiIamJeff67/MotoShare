import { integer, boolean, pgTable, text, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { PassengerTable } from "./schema";
import { userRoleEnum } from "./enums";

export const PassengerInfoTable = pgTable("passengerInfo", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => PassengerTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(), // one-to-one
    isOnline: boolean("isOnline").notNull().default(true),
    age: integer("age"),
    phoneNumber: text("phoneNumber").unique(),
    emergencyUserRole: userRoleEnum(), 
    emergencyPhoneNumber: text("emergencyPhoneNumber"), 
    selfIntroduction: text("selfIntroduction"),
    avatorUrl: text("avatorUrl"),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(), 
}, (table) => {
    return {
        userIdIndex: uniqueIndex("passengerInfo_userIdIndex").on(table.userId), 
        phoneNumberIndex: uniqueIndex("passengerInfo_phoneNumberIndex").on(table.phoneNumber), 
    };
});

export const PassengerInfoRelation = relations(PassengerInfoTable, ({ one }) => ({
    user: one(PassengerTable, {
        fields: [PassengerInfoTable.userId],
        references: [PassengerTable.id],
    }),
}));
