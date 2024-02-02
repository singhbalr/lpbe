ALTER TABLE "public"."exchanges" ADD COLUMN "exchange_type_id" text;
ALTER TABLE "public"."exchanges" ALTER COLUMN "exchange_type_id" DROP NOT NULL;
