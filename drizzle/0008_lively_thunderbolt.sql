ALTER TABLE "order" RENAME COLUMN "endAt" TO "endedAt";--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_passengerId_passenger_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_ridderId_ridder_id_fk";
--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "startAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "endAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "startAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "endAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "passengerInvite" ADD COLUMN "startAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "passengerInvite" ADD COLUMN "endAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ADD COLUMN "startAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ADD COLUMN "endAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderInvite" ADD COLUMN "startAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderInvite" ADD COLUMN "endAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplyOrder" ADD COLUMN "startAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplyOrder" ADD COLUMN "endAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_passengerId_passenger_id_fk" FOREIGN KEY ("passengerId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_ridderId_ridder_id_fk" FOREIGN KEY ("ridderId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
