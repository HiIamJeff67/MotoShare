CREATE INDEX IF NOT EXISTS "history_passengerIdIndex" ON "history" USING btree ("passengerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_ridderIdIndex" ON "history" USING btree ("ridderId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_updatedAtIndex" ON "history" USING btree ("udpatedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_passengerIdIndex" ON "order" USING btree ("passengerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_ridderIdIndex" ON "order" USING btree ("ridderId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_startAfterIndex" ON "order" USING btree ("startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_statusStartAfterIndex" ON "order" USING btree ("passengerStatus","ridderStatus","startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_updatedAtIndex" ON "order" USING btree ("updatedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerInvite_startAfterIndex" ON "passengerInvite" USING btree ("suggestStartAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "puchaseOrder_startAfterIndex" ON "purchaseOrder" USING btree ("startAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderInvite_startAfterIndex" ON "ridderInvite" USING btree ("suggestStartAfter");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "supplyOrder_startAfterIndex" ON "supplyOrder" USING btree ("startAfter");
