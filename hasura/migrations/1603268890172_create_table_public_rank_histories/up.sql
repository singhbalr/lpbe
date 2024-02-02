CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."rank_histories"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" text NOT NULL, "from_rank_id" text NOT NULL, "to_rank_id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE cascade);
