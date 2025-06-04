import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const journeys = pgTable("journeys", {
	id: serial("id").primaryKey().notNull(),
	sessionId: text("session_id").unique().notNull(),
	firstTouchpoint: text("first_touchpoint").notNull(),
	lastTouchpoint: text("last_touchpoint").notNull(),
	createdAt: text("created_at").notNull(),
});
