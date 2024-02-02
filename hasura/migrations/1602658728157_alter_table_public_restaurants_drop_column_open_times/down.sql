ALTER TABLE "public"."restaurants" ADD COLUMN "open_times" jsonb;
ALTER TABLE "public"."restaurants" ALTER COLUMN "open_times" DROP NOT NULL;
