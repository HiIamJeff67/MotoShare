ALTER TABLE "order" ALTER COLUMN "ridderStatus" SET DATA TYPE ridderOrderStatus;--> statement-breakpoint
ALTER TABLE "passengerInvite" ADD COLUMN "suggestEndedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ADD COLUMN "endedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderInvite" ADD COLUMN "suggestEndedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "supplyOrder" ADD COLUMN "endedAt" timestamp DEFAULT now() NOT NULL;