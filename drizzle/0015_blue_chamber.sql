DROP INDEX IF EXISTS "startAfterIndex";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idIndex" ON "purchaseOrder" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creatorIdIndex" ON "purchaseOrder" USING btree ("creatorId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statusStartAfterIndex" ON "purchaseOrder" USING btree ("startAfter","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "startCordIndex" ON "purchaseOrder" USING btree ("startCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "endCordIndex" ON "purchaseOrder" USING btree ("endCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "startCordEndCordIndex" ON "purchaseOrder" USING btree ("startCord","endCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "updatedAtIndex" ON "purchaseOrder" USING btree ("updatedAt");