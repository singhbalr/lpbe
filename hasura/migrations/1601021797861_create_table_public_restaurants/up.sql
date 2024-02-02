CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE TABLE "public"."restaurants"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "location" GEOGRAPHY(Point), "address" text, "phone_number" text, PRIMARY KEY ("id") );
