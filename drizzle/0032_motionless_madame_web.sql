CREATE TYPE "userRole" AS ENUM ('Passenger', 'Ridder', 'Admin', 'Guest');--> statement-breakpoint
ALTER TABLE "passengerInfo" ADD COLUMN "emergencyUserRole" "userRole";--> statement-breakpoint
ALTER TABLE "passengerInfo" ADD COLUMN "emergencyPhoneNumber" text;--> statement-breakpoint
ALTER TABLE "ridderInfo" ADD COLUMN "emergencyUserRole" "userRole";--> statement-breakpoint
ALTER TABLE "ridderInfo" ADD COLUMN "emergencyPhoneNumber" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passengerAuth_userIdIndex" ON "passengerAuth" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "passengerAuth_authCodeIndex" ON "passengerAuth" USING btree ("authCode");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passengerInfo_phoneNumberIndex" ON "passengerInfo" USING btree ("phoneNumber");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridderAuth_userIdIndex" ON "ridderAuth" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ridderAuth_authCodeIndex" ON "ridderAuth" USING btree ("authCode");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ridderInfo_phoneNumberIndex" ON "ridderInfo" USING btree ("phoneNumber");