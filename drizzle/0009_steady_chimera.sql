ALTER TABLE "history" RENAME COLUMN "startAddress" TO "passengerStartAddress";--> statement-breakpoint
ALTER TABLE "history" RENAME COLUMN "endAddress" TO "passengerEndAddress";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "startAddress" TO "passengerStartAddress";--> statement-breakpoint
ALTER TABLE "order" RENAME COLUMN "endAddress" TO "passengerEndAddress";--> statement-breakpoint
ALTER TABLE "ridderInvite" ALTER COLUMN "startAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ridderInvite" ALTER COLUMN "endAddress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "ridderStartAddress" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "ridderStartAddress" text DEFAULT '' NOT NULL;