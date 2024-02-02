ALTER TABLE "public"."restaurants" ADD COLUMN "time_open" text;
ALTER TABLE "public"."restaurants" ALTER COLUMN "time_open" DROP NOT NULL;
