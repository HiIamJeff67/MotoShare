CREATE TYPE "daysOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "periodicPurchaseOrder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid NOT NULL,
	"orderData" jsonb NOT NULL,
	"scheduledDay" "daysOfWeek" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "periodicSupplyOrder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid NOT NULL,
	"orderData" jsonb NOT NULL,
	"scheduledDay" "daysOfWeek" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "periodicPurchaseOrder" ADD CONSTRAINT "periodicPurchaseOrder_creatorId_passenger_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "periodicSupplyOrder" ADD CONSTRAINT "periodicSupplyOrder_creatorId_ridder_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicPurchaseOrder_creatorIdIndex" ON "periodicPurchaseOrder" USING btree ("creatorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicPurchaseOrder_scheduledDayIndex" ON "periodicPurchaseOrder" USING btree ("scheduledDay");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicPurchaseOrder_updatedAtIndex" ON "periodicPurchaseOrder" USING btree ("updatedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicSupplyOrder_creatorIdIndex" ON "periodicSupplyOrder" USING btree ("creatorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicSupplyOrder_scheduledDayIndex" ON "periodicSupplyOrder" USING btree ("scheduledDay");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicSupplyOrder_updatedAtIndex" ON "periodicSupplyOrder" USING btree ("updatedAt");