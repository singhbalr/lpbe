CREATE TABLE "public"."transaction_type"("id" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
INSERT INTO transaction_type VALUES('CHECKIN');
INSERT INTO transaction_type VALUES('EXCHANGE');
INSERT INTO transaction_type VALUES('INSTALL');
INSERT INTO transaction_type VALUES('COLLECT');