alter table "public"."exchanges"
           add constraint "exchanges_exchange_type_id_fkey"
           foreign key ("exchange_type_id")
           references "public"."exchange_types"
           ("id") on update restrict on delete restrict;
