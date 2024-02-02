ALTER TABLE "public"."users" ADD COLUMN "can_get_ambassador_benefit" bool;
ALTER TABLE "public"."users" ALTER COLUMN "can_get_ambassador_benefit" DROP NOT NULL;
ALTER TABLE "public"."users" ALTER COLUMN "can_get_ambassador_benefit" SET DEFAULT false;
