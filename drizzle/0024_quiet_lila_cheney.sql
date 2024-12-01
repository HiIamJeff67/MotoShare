CREATE TYPE "notificationType" AS ENUM ('PurchaseOrder', 'SupplyOrder', 'PassengerInvite', 'RidderInvite', 'Order', 'History', 'Payment', 'System');-->statement-breakpoint
CREATE TABLE IF NOT EXISTS "passengerNotification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"title" text NOT NULL,
	"description" text,
	"notificationType" "notificationType" NOT NULL,
	"linkId" text,
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderNotification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"title" text NOT NULL,
	"description" text,
	"notificationType" "notificationType" NOT NULL,
	"linkId" text,
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerNotification" ADD CONSTRAINT "passengerNotification_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderNotification" ADD CONSTRAINT "ridderNotification_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerNotification_userIdIndex" ON "passengerNotification" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerNotification_createdAtIndex" ON "passengerNotification" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderNotification_userIdIndex" ON "ridderNotification" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderNotification_createdAtIndex" ON "ridderNotification" USING btree ("createdAt");