ALTER TABLE "passengerInfo" RENAME COLUMN "createdAt" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "ridderInfo" RENAME COLUMN "createdAt" TO "updatedAt";--> statement-breakpoint
DROP INDEX IF EXISTS "purchaseOrder_idIndex";--> statement-breakpoint
DROP INDEX IF EXISTS "supplyOrder_idIndex";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passenger_userNameIndex" ON "passenger" USING btree ("userName");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passenger_emailIndex" ON "passenger" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerCollectionsToOrders_userIdIndex" ON "passengerCollectionsToOrders" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerCollectionsToOrders_orderIdIndex" ON "passengerCollectionsToOrders" USING btree ("orderId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passengerInfo_userIdIndex" ON "passengerInfo" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_userIdIndex" ON "passengerInvite" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_orderIdIndex" ON "passengerInvite" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_statusStartAfterIndex" ON "passengerInvite" USING btree ("status","suggestStartAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_updatedAtIndex" ON "passengerInvite" USING btree ("updatedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_startCordIndex" ON "passengerInvite" USING GIST ("startCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_endCordIndex" ON "passengerInvite" USING GIST ("endCord");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridder_userNameIndex" ON "ridder" USING btree ("userName");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridder_emailIndex" ON "ridder" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderCollectionsToOrders_userIdIndex" ON "ridderCollectionsToOrders" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderCollectionsToOrders_orderIdIndex" ON "ridderCollectionsToOrders" USING btree ("orderId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridderInfo_userIdIndex" ON "ridderInfo" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderInvite_userIdIndex" ON "ridderInvite" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderInvite_orderIdIndex" ON "ridderInvite" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderInvite_statusStartAfterIndex" ON "ridderInvite" USING btree ("status","suggestStartAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderInvite_updatedAtIndex" ON "ridderInvite" USING btree ("updatedAt" DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS "ridderInvite_startCordIndex" ON "ridderInvite" USING GIST ("startCord");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderInvite_endCordIndex" ON "ridderInvite" USING GIST ("endCord");--> statement-breakpoint
