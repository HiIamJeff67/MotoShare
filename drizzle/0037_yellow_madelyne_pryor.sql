CREATE TABLE IF NOT EXISTS "ridderRecord" (
	"id" uuid DEFAULT gen_random_uuid(),
	"userId" uuid,
	"searchRecords" jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
	CONSTRAINT "ridderRecord_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderRecord" ADD CONSTRAINT "ridderRecord_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridderRecord_userIdIndex" ON "ridderRecord" USING btree ("userId");