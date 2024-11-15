ALTER TABLE "history" ADD COLUMN "prevOrderId" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "prevOrderId" text DEFAULT '' NOT NULL;