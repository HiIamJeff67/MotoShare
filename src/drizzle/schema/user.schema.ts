import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
    id: serial("id").primaryKey(),  // serial means auto increment integer
    userName: text("userName").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
})