import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { journeys } from "./journeys";

export const touchpoints = pgTable("touchpoints", {
	id: serial("id").primaryKey().notNull(),
	sessionId: text("session_id").notNull(),
	journeyId: serial("journey_id")
		.references(() => journeys.id, { onDelete: "cascade" })
		.notNull(),
	source: text("source").notNull(),
	content: text("content"),
	campaign: text("campaign"),
	medium: text("medium"),
	createdAt: text("created_at").notNull(),
	position: integer("position").notNull(),
});
