ALTER TABLE "public"."menus" ADD COLUMN "restaurant_id" uuid;
ALTER TABLE "public"."menus" ALTER COLUMN "restaurant_id" DROP NOT NULL;
ALTER TABLE "public"."menus" ADD CONSTRAINT menus_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES "public"."restaurants" (id) ON DELETE set null ON UPDATE restrict;
ALTER TABLE "public"."menus" ADD CONSTRAINT menus_restaurant_id_type_id_key UNIQUE (restaurant_id, type_id);
