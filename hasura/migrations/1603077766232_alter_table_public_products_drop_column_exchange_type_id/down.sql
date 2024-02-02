ALTER TABLE "public"."products" ADD COLUMN "exchange_type_id" text;
ALTER TABLE "public"."products" ALTER COLUMN "exchange_type_id" DROP NOT NULL;
