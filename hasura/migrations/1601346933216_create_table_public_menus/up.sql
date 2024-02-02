CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."menus"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "restaurant_id" uuid, "image" uuid, "name" text NOT NULL, "point" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON UPDATE restrict ON DELETE set null, UNIQUE ("name"));
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
CREATE TRIGGER "set_public_menus_updated_at"
BEFORE UPDATE ON "public"."menus"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_menus_updated_at" ON "public"."menus" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
