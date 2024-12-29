ALTER TABLE "passengerInfo" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderInfo" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;