DROP TRIGGER IF EXISTS "set_public_exchanges_updated_at" ON "public"."exchanges";
ALTER TABLE "public"."exchanges" DROP COLUMN "updated_at";
