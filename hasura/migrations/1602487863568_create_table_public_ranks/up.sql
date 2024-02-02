CREATE TABLE "public"."ranks"("id" text NOT NULL, "from_point" integer, "to_point" integer, "checkin_rate" numeric NOT NULL, PRIMARY KEY ("id") );
INSERT INTO "public"."ranks" (id, from_point, to_point, checkin_rate) VALUES('Mate',NULL,19,1);
INSERT INTO "public"."ranks" (id, from_point, to_point, checkin_rate) VALUES('Friend',20,34,2);
INSERT INTO "public"."ranks" (id, from_point, to_point, checkin_rate) VALUES('Best Friend',35,49,3);
INSERT INTO "public"."ranks" (id, from_point, to_point, checkin_rate) VALUES('Partner',50,59,5);
INSERT INTO "public"."ranks" (id, from_point, to_point, checkin_rate) VALUES('Ambassador',60,NULL,5);