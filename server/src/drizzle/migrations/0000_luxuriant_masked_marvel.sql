CREATE TABLE "journeys" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"first_touchpoint" text NOT NULL,
	"last_touchpoint" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "touchpoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"journey_id" serial NOT NULL,
	"source" text NOT NULL,
	"content" text,
	"campaign" text,
	"medium" text,
	"created_at" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "touchpoints" ADD CONSTRAINT "touchpoints_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;