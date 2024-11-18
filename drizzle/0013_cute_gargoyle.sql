ALTER TABLE "history" RENAME COLUMN "passengerStartCord" TO "finalStartCord";--> statement-breakpoint
ALTER TABLE "history" RENAME COLUMN "passengerEndCord" TO "finalEndCord";--> statement-breakpoint
ALTER TABLE "history" RENAME COLUMN "passengerStartAddress" TO "finalStartAddress";--> statement-breakpoint
ALTER TABLE "history" RENAME COLUMN "passengerEndAddress" TO "finalEndAddress";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "passengerStartCord" TO "finalStartCord";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "passengerEndCord" TO "finalEndCord";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "passengerStartAddress" TO "finalStartAddress";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "passengerEndAddress" TO "finalEndAddress";--> statement-breakpoint
ALTER TABLE "history" DROP COLUMN IF EXISTS "ridderStartCord";--> statement-breakpoint
ALTER TABLE "history" DROP COLUMN IF EXISTS "ridderStartAddress";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN IF EXISTS "ridderStartCord";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN IF EXISTS "ridderStartAddress";