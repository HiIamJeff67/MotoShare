CREATE TABLE IF NOT EXISTS "passengerPreferences" (
	"userId" uuid NOT NULL,
	"preferenceUserId" uuid NOT NULL,
	CONSTRAINT "passengerPreferences_userId_preferenceUserId_pk" PRIMARY KEY("userId","preferenceUserId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderPreferences" (
	"userId" uuid NOT NULL,
	"preferenceUserId" uuid NOT NULL,
	CONSTRAINT "ridderPreferences_userId_preferenceUserId_pk" PRIMARY KEY("userId","preferenceUserId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerPreferences" ADD CONSTRAINT "passengerPreferences_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerPreferences" ADD CONSTRAINT "passengerPreferences_preferenceUserId_ridder_id_fk" FOREIGN KEY ("preferenceUserId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderPreferences" ADD CONSTRAINT "ridderPreferences_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderPreferences" ADD CONSTRAINT "ridderPreferences_preferenceUserId_passenger_id_fk" FOREIGN KEY ("preferenceUserId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerPreferences_userIdIndex" ON "passengerPreferences" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerPreferences_preferenceUserIdIndex" ON "passengerPreferences" USING btree ("preferenceUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderPreferences_userIdIndex" ON "ridderPreferences" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderPreferences_preferenceUserIdIndex" ON "ridderPreferences" USING btree ("preferenceUserId");