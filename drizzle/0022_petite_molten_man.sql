ALTER TABLE "purchaseOrder" ADD COLUMN "autoAccept" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "supplyOrder" ADD COLUMN "autoAccept" boolean DEFAULT false NOT NULL;