alter table "public"."exchange_products" add constraint "exchange_products_amount" check (amount >= 1);
