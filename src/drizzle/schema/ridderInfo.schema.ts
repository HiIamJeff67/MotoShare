import { integer, boolean, pgTable, text, uuid, timestamp, uniqueIndex, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { RidderTable } from "./schema";
import { userRoleEnum } from "./enums";

export const RidderInfoTable = pgTable("ridderInfo", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),    // one-to-one
    isOnline: boolean("isOnline").notNull().default(true),
    age: integer("age"),
    phoneNumber: text("phoneNumber").unique(),
    emergencyUserRole: userRoleEnum(), 
    emergencyPhoneNumber: text("emergencyPhoneNumber"), 
    selfIntroduction: text("selfIntroduction"),
    avatorUrl: text("avatorUrl"),
    motocycleLicense: text("motocycleLicense").unique(),
    motocycleType: text("motocycleType"),
    motocyclePhotoUrl: text("motocyclePhotoUrl"),
    avgStarRating: doublePrecision("averageStarRating").notNull().default(0), 
    createdAt: timestamp("createdAt").notNull().defaultNow(), 
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
    return {
        userIdIndex: uniqueIndex("ridderInfo_userIdIndex").on(table.userId), 
        phoneNumberIndex: uniqueIndex("ridderInfo_phoneNumberIndex").on(table.phoneNumber), 
    };
});

export const RidderInfoRelation = relations(RidderInfoTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderInfoTable.userId],
        references: [RidderTable.id],
    }),
}));