alter table "public"."restaurants"
           add constraint "restaurants_business_type_id_fkey"
           foreign key ("business_type_id")
           references "public"."business_types"
           ("id") on update restrict on delete set null;
