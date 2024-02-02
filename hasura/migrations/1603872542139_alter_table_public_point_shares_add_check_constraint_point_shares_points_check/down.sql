alter table "public"."point_shares" drop constraint "point_shares_points_check";
alter table "public"."point_shares" add constraint "point_shares_points_check" check (CHECK (points > 0 AND points <= 1000));
