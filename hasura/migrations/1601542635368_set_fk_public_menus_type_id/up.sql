alter table "public"."menus"
           add constraint "menus_type_id_fkey"
           foreign key ("type_id")
           references "public"."menu_types"
           ("id") on update restrict on delete restrict;
