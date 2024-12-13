ALTER TABLE "passengerAuth" ADD COLUMN "googleId" uuid;--> statement-breakpoint
ALTER TABLE "ridderAuth" ADD COLUMN "googleId" uuid;--> statement-breakpoint
ALTER TABLE "passengerAuth" DROP COLUMN IF EXISTS "isGoogleAuthenticated";--> statement-breakpoint
ALTER TABLE "ridderAuth" DROP COLUMN IF EXISTS "isGoogleAuthenticated";