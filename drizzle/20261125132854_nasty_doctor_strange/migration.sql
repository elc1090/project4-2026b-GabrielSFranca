CREATE TYPE "media_type" AS ENUM('movie', 'tv');--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"id_usuario" uuid NOT NULL,
	"tmdb_id" integer NOT NULL,
	"media_type" "media_type" NOT NULL,
	"titulo" varchar(255) NOT NULL,
	CONSTRAINT "id_positivo" CHECK ("tmdb_id" > 0),
	CONSTRAINT "titulo_nao_nulo" CHECK (length(btrim("titulo")) > 0)
);
--> statement-breakpoint
CREATE TABLE "playlist_items" (
	"playlist_id" uuid,
	"media_item_id" uuid,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "playlist_items_pkey" PRIMARY KEY("playlist_id","media_item_id")
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"nome" varchar(80) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pl_nome_unico" UNIQUE("user_id","nome"),
	CONSTRAINT "pl_nome_nao_vazio" CHECK (length(btrim("nome")) > 0)
);
--> statement-breakpoint
CREATE TABLE "user_review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"media_id" uuid NOT NULL,
	"id_usuario" uuid NOT NULL,
	"fav" boolean DEFAULT false NOT NULL,
	"assistido" boolean DEFAULT false NOT NULL,
	"nota" smallint,
	"aval_titulo" varchar(160),
	"aval_texto" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_titles_user_title_unique" UNIQUE("id_usuario","media_id"),
	CONSTRAINT "user_titles_review_consistency" CHECK ((
        "aval_titulo" IS NULL
        AND "aval_texto" IS NULL
      ) OR (
        "nota" IS NOT NULL
        AND "aval_titulo" IS NOT NULL
        AND length(btrim("aval_titulo")) > 0
        AND "aval_texto" IS NOT NULL
        AND length(btrim("aval_texto")) > 0
      )),
	CONSTRAINT "user_titles_rating_range" CHECK ("nota" IS NULL OR "nota" BETWEEN 1 AND 10),
	CONSTRAINT "user_titles_has_interaction" CHECK ("assistido" OR "fav" OR "nota" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "media_usr_tmdb_type_idx" ON "media" ("tmdb_id","media_type");--> statement-breakpoint
CREATE INDEX "playlist_titles_title_id_idx" ON "playlist_items" ("media_item_id");--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_id_usuario_usuario_id_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_playlist_id_playlists_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_media_item_id_media_id_fkey" FOREIGN KEY ("media_item_id") REFERENCES "media"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_user_id_usuario_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_review" ADD CONSTRAINT "user_review_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_review" ADD CONSTRAINT "user_review_id_usuario_usuario_id_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE;