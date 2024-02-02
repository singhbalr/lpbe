alter table "public"."exchange_products" add foreign key ("restaurant_id") references "public"."restaurants"("id") on update restrict on delete restrict;
