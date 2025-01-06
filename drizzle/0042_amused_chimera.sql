CREATE TABLE IF NOT EXISTS "passengerBank" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"balance" double precision DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "passengerBank_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderBank" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"balance" double precision DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ridderBank_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerBank" ADD CONSTRAINT "passengerBank_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderBank" ADD CONSTRAINT "ridderBank_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passengerBank_userIdIndex" ON "passengerBank" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerBank_updatedAtIndex" ON "passengerBank" USING btree ("updatedAt");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridderBank_userIdIndex" ON "ridderBank" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderBank_updatedAtIndex" ON "ridderBank" USING btree ("updatedAt");