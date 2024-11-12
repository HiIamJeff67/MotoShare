ALTER TABLE "order" ALTER COLUMN "passengerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "ridderId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passengerInvite" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passengerInvite" ALTER COLUMN "orderId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchaseOrder" ALTER COLUMN "creatorId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderInvite" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ridderInvite" ALTER COLUMN "orderId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplyOrder" ALTER COLUMN "creatorId" SET NOT NULL;