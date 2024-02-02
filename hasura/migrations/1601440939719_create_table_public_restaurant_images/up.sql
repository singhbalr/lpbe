CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."restaurant_images"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "restaurant_id" uuid NOT NULL, "image_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("restaurant_id", "image_id"));
