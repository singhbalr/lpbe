alter table "public"."users"
           add constraint "users_rank_id_fkey"
           foreign key ("rank_id")
           references "public"."ranks"
           ("id") on update restrict on delete restrict;
