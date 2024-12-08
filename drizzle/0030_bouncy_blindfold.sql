ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "initPrice" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "startCord" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "endCord" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "startAddress" text NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "endAddress" text NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "startAfter" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "endedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" ADD COLUMN "isUrgent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "initPrice" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "startCord" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "endCord" geometry(point) NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "startAddress" text NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "endAddress" text NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "startAfter" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "endedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" ADD COLUMN "tolerableRDV" double precision DEFAULT 5 NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicPurchaseOrder_startAfterIndex" ON "periodicPurchaseOrder" USING btree ("startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicPurchaseOrder_endedAtIndex" ON "periodicPurchaseOrder" USING btree ("endedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicSupplyOrder_startAfterIndex" ON "periodicSupplyOrder" USING btree ("startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "periodicSupplyOrder_endedAtIndex" ON "periodicSupplyOrder" USING btree ("endedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_endedAtIndex" ON "purchaseOrder" USING btree ("endedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_endedAtIndex" ON "supplyOrder" USING btree ("endedAt");--> statement-breakpoint
ALTER TABLE "periodicPurchaseOrder" DROP COLUMN IF EXISTS "orderData";--> statement-breakpoint
ALTER TABLE "periodicSupplyOrder" DROP COLUMN IF EXISTS "orderData";