ALTER TABLE "passengerAuth" ALTER COLUMN "googleId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ridderAuth" ALTER COLUMN "googleId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "passengerAuth" ADD CONSTRAINT "passengerAuth_googleId_unique" UNIQUE("googleId");--> statement-breakpoint
ALTER TABLE "ridderAuth" ADD CONSTRAINT "ridderAuth_googleId_unique" UNIQUE("googleId");