ALTER TABLE "public"."menus" ADD COLUMN "point" int4;
ALTER TABLE "public"."menus" ALTER COLUMN "point" DROP NOT NULL;
