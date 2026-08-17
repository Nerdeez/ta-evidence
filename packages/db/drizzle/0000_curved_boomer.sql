CREATE TABLE "daily_bars" (
	"security_id" bigint NOT NULL,
	"date" date NOT NULL,
	"open" numeric(18, 6) NOT NULL,
	"high" numeric(18, 6) NOT NULL,
	"low" numeric(18, 6) NOT NULL,
	"close" numeric(18, 6) NOT NULL,
	"adjusted_close" numeric(18, 6) NOT NULL,
	"volume" bigint NOT NULL,
	CONSTRAINT "daily_bars_security_id_date_pk" PRIMARY KEY("security_id","date")
);
--> statement-breakpoint
CREATE TABLE "securities" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"ticker" varchar(16) NOT NULL,
	"exchange" varchar(16) NOT NULL,
	"name" text,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"asset_type" varchar(16) DEFAULT 'equity' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_bars" ADD CONSTRAINT "daily_bars_security_id_securities_id_fk" FOREIGN KEY ("security_id") REFERENCES "public"."securities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "securities_ticker_exchange_uidx" ON "securities" USING btree ("ticker","exchange");