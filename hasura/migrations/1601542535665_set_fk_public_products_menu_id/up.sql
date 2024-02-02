alter table "public"."products"
           add constraint "products_menu_id_fkey"
           foreign key ("menu_id")
           references "public"."menus"
           ("id") on update restrict on delete restrict;
