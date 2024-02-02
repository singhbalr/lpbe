ALTER TABLE "public"."restaurants" ADD COLUMN "suggested_move" text;
ALTER TABLE "public"."restaurants" ALTER COLUMN "suggested_move" DROP NOT NULL;
