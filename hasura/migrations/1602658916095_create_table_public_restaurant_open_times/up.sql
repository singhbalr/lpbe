CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."restaurant_open_times"("restaurant_id" uuid NOT NULL, "day_of_week" integer NOT NULL, "open_time" timetz NOT NULL, "close_time" timetz NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY ("id") , FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON UPDATE restrict ON DELETE cascade);
