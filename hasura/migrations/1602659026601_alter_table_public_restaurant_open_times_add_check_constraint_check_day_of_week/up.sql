alter table "public"."restaurant_open_times" add constraint "check_day_of_week" check (day_of_week >= 0 and day_of_week <= 6);
