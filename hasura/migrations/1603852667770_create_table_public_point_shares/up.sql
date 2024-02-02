CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."point_shares"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "restaurant_id" uuid NOT NULL, "balance" integer NOT NULL, "points" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON UPDATE restrict ON DELETE restrict, CONSTRAINT "point_shares_balance_check" CHECK (balance >= 0), CONSTRAINT "point_shares_points_check" CHECK (points > 0 and points <= 1000));
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
CREATE TRIGGER "set_public_point_shares_updated_at"
BEFORE UPDATE ON "public"."point_shares"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_point_shares_updated_at" ON "public"."point_shares" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
