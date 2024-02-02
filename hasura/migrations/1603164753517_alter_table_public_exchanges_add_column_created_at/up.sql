ALTER TABLE "public"."exchanges" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();
