CREATE TABLE "public"."users"("id" text NOT NULL, "email" text NOT NULL, "name" text NOT NULL, "birthdate" date NOT NULL, "gender_id" text NOT NULL DEFAULT 'other', "restaurant_id" uuid, "role_id" text NOT NULL DEFAULT 'user', "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("email"));
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
CREATE TRIGGER "set_public_users_updated_at"
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_users_updated_at" ON "public"."users" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
