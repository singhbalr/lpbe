ALTER TABLE "public"."menus" ADD COLUMN "image" uuid;
ALTER TABLE "public"."menus" ALTER COLUMN "image" DROP NOT NULL;
