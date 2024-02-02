alter table "public"."points" drop constraint "points_user_id_fkey",
             add constraint "points_user_id_fkey"
             foreign key ("user_id")
             references "public"."users"
             ("id") on update restrict on delete cascade;
