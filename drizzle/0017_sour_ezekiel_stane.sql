DROP INDEX IF EXISTS "purchaseOrder_updatedAtIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "supplyOrder_updatedAtIndex";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_updatedAtIndex" ON "purchaseOrder" USING btree ("updatedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_updatedAtIndex" ON "supplyOrder" USING btree ("updatedAt" DESC NULLS LAST);