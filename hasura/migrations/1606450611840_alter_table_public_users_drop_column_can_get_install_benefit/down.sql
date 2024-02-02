ALTER TABLE "public"."users" ADD COLUMN "can_get_install_benefit" bool;
ALTER TABLE "public"."users" ALTER COLUMN "can_get_install_benefit" DROP NOT NULL;
ALTER TABLE "public"."users" ALTER COLUMN "can_get_install_benefit" SET DEFAULT true;
