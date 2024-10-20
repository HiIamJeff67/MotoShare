import { integer, boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { RidderTable } from "./ridder.schema";
import { relations } from "drizzle-orm";

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
    motocyclePhotoUrl: text("motocyclePhotoUrl"),
});

export const RidderInfoRelation = relations(RidderInfoTable, ({ one }) => ({
    user: one(RidderTable, {
        fields: [RidderInfoTable.userId],
        references: [RidderTable.id],
    }),
}));