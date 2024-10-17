DO $$ BEGIN
 CREATE TYPE "public"."historyStatus" AS ENUM('FINISHED', 'EXPIRED', 'CANCEL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."starRating" AS ENUM('0', '1', '2', '3', '4', '5');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."orderStatus" AS ENUM('UNSTARTED', 'STARTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."postStatus" AS ENUM('POSTED', 'EXPIRED', 'CANCEL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"passengerId" uuid,
	"ridderId" uuid,
	"finalPrice" integer NOT NULL,
	"passengerStartCord" geometry(point) NOT NULL,
	"passengerEndCord" geometry(point) NOT NULL,
	"ridderStartCord" geometry(point) NOT NULL,
	"startAfter" timestamp DEFAULT now() NOT NULL,
	"endedAt" timestamp DEFAULT now() NOT NULL,
	"starRatingByPassenger" "starRating" DEFAULT '0' NOT NULL,
	"starRatingByRidder" "starRating" DEFAULT '0' NOT NULL,
	"commentByP" text,
	"commentByR" text,
	"status" "historyStatus" DEFAULT 'FINISHED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"passengerId" uuid,
	"ridderId" uuid,
	"finalPrice" integer NOT NULL,
	"passengerStartCord" geometry(point) NOT NULL,
	"passengerEndCord" geometry(point) NOT NULL,
	"ridderStartCord" geometry(point) NOT NULL,
	"startAfter" timestamp DEFAULT now() NOT NULL,
	"status" "orderStatus" DEFAULT 'UNSTARTED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passenger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userName" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "passenger_userName_unique" UNIQUE("userName"),
	CONSTRAINT "passenger_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passengerCollection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "passengerCollection_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passengerCollectionsToOrders" (
	"collectionId" uuid NOT NULL,
	"orderId" uuid NOT NULL,
	CONSTRAINT "passengerCollectionsToOrders_collectionId_orderId_pk" PRIMARY KEY("collectionId","orderId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passengerInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"isOnline" boolean DEFAULT false NOT NULL,
	"age" integer,
	"phoneNumber" text,
	"selfIntroduction" text,
	"avatorUrl" text,
	CONSTRAINT "passengerInfo_userId_unique" UNIQUE("userId"),
	CONSTRAINT "passengerInfo_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchaseOrder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid,
	"description" text,
	"initPrice" integer NOT NULL,
	"startCord" geometry(point) NOT NULL,
	"endCord" geometry(point) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"startAfter" timestamp DEFAULT now() NOT NULL,
	"isUrgent" boolean DEFAULT false NOT NULL,
	"status" "postStatus" DEFAULT 'POSTED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userName" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "ridder_userName_unique" UNIQUE("userName"),
	CONSTRAINT "ridder_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderCollection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "ridderCollection_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderCollectionsToOrders" (
	"collectionId" uuid NOT NULL,
	"orderId" uuid NOT NULL,
	CONSTRAINT "ridderCollectionsToOrders_collectionId_orderId_pk" PRIMARY KEY("collectionId","orderId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ridderInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"isOnline" boolean DEFAULT false NOT NULL,
	"age" integer,
	"phoneNumber" text,
	"selfIntroduction" text,
	"motocycleLicense" text,
	"motocyclePhotoUrl" text,
	"avatorUrl" text,
	CONSTRAINT "ridderInfo_userId_unique" UNIQUE("userId"),
	CONSTRAINT "ridderInfo_phoneNumber_unique" UNIQUE("phoneNumber"),
	CONSTRAINT "ridderInfo_motocycleLicense_unique" UNIQUE("motocycleLicense")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplyOrder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creatorId" uuid,
	"description" text,
	"initPrice" integer NOT NULL,
	"startCord" geometry(point) NOT NULL,
	"endCord" geometry(point) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"startAfter" timestamp DEFAULT now() NOT NULL,
	"stauts" "postStatus" DEFAULT 'POSTED' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_passengerId_passenger_id_fk" FOREIGN KEY ("passengerId") REFERENCES "public"."passenger"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_ridderId_ridder_id_fk" FOREIGN KEY ("ridderId") REFERENCES "public"."ridder"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_passengerId_passenger_id_fk" FOREIGN KEY ("passengerId") REFERENCES "public"."passenger"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_ridderId_ridder_id_fk" FOREIGN KEY ("ridderId") REFERENCES "public"."ridder"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerCollection" ADD CONSTRAINT "passengerCollection_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerCollectionsToOrders" ADD CONSTRAINT "passengerCollectionsToOrders_collectionId_passengerCollection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."passengerCollection"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerCollectionsToOrders" ADD CONSTRAINT "passengerCollectionsToOrders_orderId_supplyOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."supplyOrder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passengerInfo" ADD CONSTRAINT "passengerInfo_userId_passenger_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchaseOrder" ADD CONSTRAINT "purchaseOrder_creatorId_passenger_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."passenger"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderCollection" ADD CONSTRAINT "ridderCollection_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderCollectionsToOrders" ADD CONSTRAINT "ridderCollectionsToOrders_collectionId_ridderCollection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."ridderCollection"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderCollectionsToOrders" ADD CONSTRAINT "ridderCollectionsToOrders_orderId_purchaseOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."purchaseOrder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ridderInfo" ADD CONSTRAINT "ridderInfo_userId_ridder_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supplyOrder" ADD CONSTRAINT "supplyOrder_creatorId_ridder_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."ridder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;