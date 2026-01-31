CREATE TABLE "scripts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"author" text NOT NULL,
	"version" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"icon" text NOT NULL,
	"match" text NOT NULL,
	"grant" text[],
	"code" text NOT NULL,
	"screenshots" text[],
	"features" text[],
	"changelog" jsonb
);
