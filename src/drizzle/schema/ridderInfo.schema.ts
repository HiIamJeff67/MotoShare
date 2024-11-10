import { integer, boolean, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { RidderTable } from "./schema";

export const RidderInfoTable = pgTable("ridderInfo", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => RidderTable.id, {
        onDelete: 'cascade',
    }).notNull().unique(),    // one-to-one
    isOnline: boolean("isOnline").notNull().default(true),
    age: integer("age"),
    phoneNumber: text("phoneNumber").unique(),
    selfIntroduction: text("selfIntroduction"),
    avatorUrl: text("avatorUrl"),
    motocycleLicense: text("motocycleLicense").unique(),
    motocycleType: text("motocycleType"),
    motocyclePhotoUrl: text("motocyclePhotoUrl"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const RidderInfoRelation = relations(RidderInfoTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderInfoTable.userId],
        references: [RidderTable.id],
    }),
}));