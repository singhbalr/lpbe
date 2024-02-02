alter table "public"."menus"
           add constraint "menus_restaurant_type_id_fkey"
           foreign key ("restaurant_type_id")
           references "public"."restaurant_types"
           ("id") on update restrict on delete restrict;
