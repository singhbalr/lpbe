CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."answers"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "question_id" uuid NOT NULL, "title" text NOT NULL, "is_correct" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON UPDATE restrict ON DELETE restrict);
