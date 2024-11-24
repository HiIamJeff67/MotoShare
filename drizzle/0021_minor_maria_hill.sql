ALTER TABLE "passenger" ALTER COLUMN "accessToken" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "passenger" ALTER COLUMN "accessToken" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ridder" ALTER COLUMN "accessToken" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ridder" ALTER COLUMN "accessToken" DROP DEFAULT;