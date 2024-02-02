ALTER TABLE "public"."restaurants" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();
