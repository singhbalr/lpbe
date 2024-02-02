alter table "public"."points" add constraint "points_balance_check" check (balance >= 0);
