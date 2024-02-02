ALTER TABLE "public"."exchange_products" ADD COLUMN "restaurant_id" uuid;
ALTER TABLE "public"."exchange_products" ALTER COLUMN "restaurant_id" DROP NOT NULL;
