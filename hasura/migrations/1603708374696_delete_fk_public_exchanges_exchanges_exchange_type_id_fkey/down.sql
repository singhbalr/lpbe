alter table "public"."exchanges" add foreign key ("exchange_type_id") references "public"."exchange_types"("id") on update restrict on delete restrict;
