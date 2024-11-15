ALTER TABLE "passengerInvite" DROP CONSTRAINT "passengerInvite_orderId_supplyOrder_id_fk";
--> statement-breakpoint
ALTER TABLE "ridderInvite" DROP CONSTRAINT "ridderInvite_orderId_purchaseOrder_id_fk";
--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "udpatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerInvite" ADD CONSTRAINT "passengerInvite_orderId_supplyOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."supplyOrder"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderInvite" ADD CONSTRAINT "ridderInvite_orderId_purchaseOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."purchaseOrder"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
