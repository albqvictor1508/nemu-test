import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const touchpoints = pgTable("touchpoints", {
	id: serial("id").primaryKey().notNull(),
	source: text("source").notNull(),
	content: text("content").notNull(),
	campaign: text("campaign").notNull(),
	createdAt: text("created_at").notNull(),
	position: serial("position").notNull(),
});
