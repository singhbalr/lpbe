CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."questions"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, PRIMARY KEY ("id") );
