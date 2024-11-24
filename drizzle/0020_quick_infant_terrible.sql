CREATE TABLE IF NOT EXISTS "passengerAuth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"isEmailAuthenticated" boolean DEFAULT false NOT NULL,
	"isPhoneAuthenticated" boolean DEFAULT false NOT NULL,
	"authCode" text NOT NULL,
	"authCodeExpiredAt" timestamp NOT NULL,
	CONSTRAINT "passengerAuth_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderAuth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"isEmailAuthenticated" boolean DEFAULT false NOT NULL,
	"isPhoneAuthenticated" boolean DEFAULT false NOT NULL,
	"authCode" text NOT NULL,
	"authCodeExpiredAt" timestamp NOT NULL,
	CONSTRAINT "ridderAuth_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "prevOrderId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "finalStartAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "finalEndAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "startAfter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "endedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "prevOrderId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "finalStartAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "finalEndAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "startAfter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "endedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "passengerInvite" ALTER COLUMN "startAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "passengerInvite" ALTER COLUMN "endAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "passengerInvite" ALTER COLUMN "suggestStartAfter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "passengerInvite" ALTER COLUMN "suggestEndedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ALTER COLUMN "startAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ALTER COLUMN "endAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ALTER COLUMN "startAfter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ALTER COLUMN "endedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ridderInvite" ALTER COLUMN "suggestStartAfter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ridderInvite" ALTER COLUMN "suggestEndedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "supplyOrder" ALTER COLUMN "startAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "supplyOrder" ALTER COLUMN "endAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "supplyOrder" ALTER COLUMN "startAfter" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "supplyOrder" ALTER COLUMN "endedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "passenger" ADD COLUMN "accessToken" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "ridder" ADD COLUMN "accessToken" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerAuth" ADD CONSTRAINT "passengerAuth_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderAuth" ADD CONSTRAINT "ridderAuth_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_accessToken_unique" UNIQUE("accessToken");--> statement-breakpoint
ALTER TABLE "ridder" ADD CONSTRAINT "ridder_accessToken_unique" UNIQUE("accessToken");