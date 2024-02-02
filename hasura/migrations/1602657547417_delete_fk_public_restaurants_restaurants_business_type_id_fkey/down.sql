alter table "public"."restaurants" add foreign key ("business_type_id") references "public"."business_types"("id") on update restrict on delete set null;
