ALTER TABLE "passengerInvite" DROP CONSTRAINT "passengerInvite_userId_passenger_id_fk";
--> statement-breakpoint
ALTER TABLE "passengerInvite" DROP CONSTRAINT "passengerInvite_orderId_supplyOrder_id_fk";
--> statement-breakpoint
ALTER TABLE "ridderInvite" DROP CONSTRAINT "ridderInvite_userId_ridder_id_fk";
--> statement-breakpoint
ALTER TABLE "ridderInvite" DROP CONSTRAINT "ridderInvite_orderId_purchaseOrder_id_fk";
--> statement-breakpoint
-- ALTER TABLE "order" ALTER COLUMN "passengerStatus" SET DATA TYPE passengerOrderStatus;--> statement-breakpoint
-- ALTER TABLE "order" ALTER COLUMN "ridderStatus" SET DATA TYPE ridderOrderStatus;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerInvite" ADD CONSTRAINT "passengerInvite_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerInvite" ADD CONSTRAINT "passengerInvite_orderId_supplyOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."supplyOrder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderInvite" ADD CONSTRAINT "ridderInvite_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderInvite" ADD CONSTRAINT "ridderInvite_orderId_purchaseOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."purchaseOrder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
