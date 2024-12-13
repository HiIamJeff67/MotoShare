ALTER TABLE "passengerAuth" ADD COLUMN "isDefaultAuthenticated" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "passengerAuth" ADD COLUMN "isGoogleAuthenticated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderAuth" ADD COLUMN "isDefaultAuthenticated" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderAuth" ADD COLUMN "isGoogleAuthenticated" boolean DEFAULT false NOT NULL;