-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "household_size" INTEGER NOT NULL DEFAULT 1,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_quotas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "searches_used" INTEGER NOT NULL DEFAULT 0,
    "period_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_searches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "ingredients" TEXT[],
    "household_size" INTEGER NOT NULL,
    "cache_key" TEXT NOT NULL,
    "result_count" INTEGER NOT NULL DEFAULT 0,
    "api_cost_estimate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "search_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source_name" TEXT,
    "source_url" TEXT,
    "time_minutes" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "servings" INTEGER NOT NULL,
    "cost_estimate" TEXT,
    "tips" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "user_has" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lexicon" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "canonical" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "synonyms" TEXT[],
    "emoji" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lexicon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "search_quotas_user_id_key" ON "search_quotas"("user_id");

-- CreateIndex
CREATE INDEX "recipe_searches_user_id_created_at_idx" ON "recipe_searches"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "recipe_searches_cache_key_idx" ON "recipe_searches"("cache_key");

-- CreateIndex
CREATE INDEX "recipes_slug_idx" ON "recipes"("slug");

-- CreateIndex
CREATE INDEX "recipes_search_id_idx" ON "recipes"("search_id");

-- CreateIndex
CREATE INDEX "ingredients_recipe_id_idx" ON "ingredients"("recipe_id");

-- CreateIndex
CREATE INDEX "steps_recipe_id_idx" ON "steps"("recipe_id");

-- CreateIndex
CREATE INDEX "tools_recipe_id_idx" ON "tools"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_recipe_id_key" ON "favorites"("user_id", "recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "lexicon_word_key" ON "lexicon"("word");

-- CreateIndex
CREATE INDEX "lexicon_canonical_idx" ON "lexicon"("canonical");

-- CreateIndex
CREATE INDEX "lexicon_category_idx" ON "lexicon"("category");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_quotas" ADD CONSTRAINT "search_quotas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_searches" ADD CONSTRAINT "recipe_searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_search_id_fkey" FOREIGN KEY ("search_id") REFERENCES "recipe_searches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
