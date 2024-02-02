alter table "public"."exchange_products"
           add constraint "exchange_products_restaurant_id_fkey"
           foreign key ("restaurant_id")
           references "public"."restaurants"
           ("id") on update restrict on delete restrict;
