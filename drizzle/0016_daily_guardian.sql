DROP INDEX IF EXISTS "idIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "creatorIdIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "statusStartAfterIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "startCordIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "endCordIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "startCordEndCordIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "updatedAtIndex";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "purchaseOrder_idIndex" ON "purchaseOrder" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_creatorIdIndex" ON "purchaseOrder" USING btree ("creatorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_statusStartAfterIndex" ON "purchaseOrder" USING btree ("status","startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_updatedAtIndex" ON "purchaseOrder" USING btree ("updatedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_startCordIndex" ON "purchaseOrder" USING GIST ("startCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "purchaseOrder_endCordIndex" ON "purchaseOrder" USING GIST ("endCord");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "supplyOrder_idIndex" ON "supplyOrder" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_creatorIdIndex" ON "supplyOrder" USING btree ("creatorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_statusStartAfterIndex" ON "supplyOrder" USING btree ("status","startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_updatedAtIndex" ON "supplyOrder" USING btree ("updatedAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_startCordIndex" ON "supplyOrder" USING GIST ("startCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_endCordIndex" ON "supplyOrder" USING GIST ("endCord");--> statement-breakpoint