CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."products"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "sku" text, "name" text NOT NULL, "name_en" text NOT NULL, "exchange_price" numeric NOT NULL DEFAULT 0, "exchange_point" integer NOT NULL DEFAULT 0, "image" uuid, "exchange_type_id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "menu_id" uuid NOT NULL, PRIMARY KEY ("id") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_products_updated_at"
BEFORE UPDATE ON "public"."products"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_products_updated_at" ON "public"."products" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
