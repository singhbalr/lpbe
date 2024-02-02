alter table "public"."exchanges"
           add constraint "exchanges_restaurant_id_fkey"
           foreign key ("restaurant_id")
           references "public"."restaurants"
           ("id") on update restrict on delete restrict;
