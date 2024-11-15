ALTER TABLE "order" RENAME COLUMN "status" TO "passengerStatus";--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "ridderStatus" "orderStatus" DEFAULT 'UNSTARTED' NOT NULL;