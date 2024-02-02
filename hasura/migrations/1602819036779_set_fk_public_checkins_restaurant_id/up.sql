alter table "public"."checkins"
           add constraint "checkins_restaurant_id_fkey"
           foreign key ("restaurant_id")
           references "public"."restaurants"
           ("id") on update restrict on delete cascade;
