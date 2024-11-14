ALTER TABLE "history" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "endAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;