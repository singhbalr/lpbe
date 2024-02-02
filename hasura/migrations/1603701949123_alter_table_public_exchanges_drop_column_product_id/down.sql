ALTER TABLE "public"."exchanges" ADD COLUMN "product_id" uuid;
ALTER TABLE "public"."exchanges" ALTER COLUMN "product_id" DROP NOT NULL;
