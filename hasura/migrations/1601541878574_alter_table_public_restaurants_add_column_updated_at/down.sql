DROP TRIGGER IF EXISTS "set_public_restaurants_updated_at" ON "public"."restaurants";
ALTER TABLE "public"."restaurants" DROP COLUMN "updated_at";
