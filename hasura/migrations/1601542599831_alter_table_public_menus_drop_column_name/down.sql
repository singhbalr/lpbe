ALTER TABLE "public"."menus" ADD COLUMN "name" text;
ALTER TABLE "public"."menus" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "public"."menus" ADD CONSTRAINT menus_name_key UNIQUE (name);
