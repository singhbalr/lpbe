CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."point_transactions"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" text NOT NULL, "before_balance" integer NOT NULL DEFAULT 0, "after_balance" integer NOT NULL DEFAULT 0, "amount" integer NOT NULL, "type_id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_point_transactions_updated_at"
BEFORE UPDATE ON "public"."point_transactions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_point_transactions_updated_at" ON "public"."point_transactions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
