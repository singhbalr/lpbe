alter table "public"."point_transactions"
           add constraint "point_transactions_type_id_fkey"
           foreign key ("type_id")
           references "public"."transaction_type"
           ("id") on update restrict on delete restrict;
