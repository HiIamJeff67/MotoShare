CREATE TABLE IF NOT EXISTS "passengerRecord" (
	"id" uuid DEFAULT gen_random_uuid(),
	"userId" uuid,
	"searchRecords" jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
	CONSTRAINT "passengerRecord_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerRecord" ADD CONSTRAINT "passengerRecord_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passengerRecord_userIdIndex" ON "passengerRecord" USING btree ("userId");