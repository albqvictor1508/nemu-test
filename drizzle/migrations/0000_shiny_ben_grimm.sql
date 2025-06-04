CREATE TABLE "journeys" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"first_touchpoint" text NOT NULL,
	"last_touchpoint" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "touchpoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"content" text NOT NULL,
	"campaign" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"position" serial NOT NULL
);
