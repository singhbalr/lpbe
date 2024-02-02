alter table "public"."exchanges" add foreign key ("product_id") references "public"."products"("id") on update restrict on delete restrict;
