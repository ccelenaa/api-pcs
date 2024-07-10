-- CreateTable
CREATE TABLE "bailleur" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(128),
    "email" VARCHAR(128) NOT NULL,
    "login" VARCHAR(32) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "locale" VARCHAR(32) NOT NULL DEFAULT 'fr-FR',
    "data" JSONB NOT NULL DEFAULT '{}',
    "verified_at" TIMESTAMP(3),
    "suspended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bailleur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestataire" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(128),
    "email" VARCHAR(128) NOT NULL,
    "login" VARCHAR(32) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "locale" VARCHAR(32) NOT NULL DEFAULT 'fr-FR',
    "data" JSONB NOT NULL DEFAULT '{}',
    "verified_at" TIMESTAMP(3),
    "suspended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "prestataire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voyageur" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(128),
    "email" VARCHAR(128) NOT NULL,
    "tel" VARCHAR(32) NOT NULL,
    "login" VARCHAR(32) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "locale" VARCHAR(32) NOT NULL DEFAULT 'fr-FR',
    "data" JSONB NOT NULL DEFAULT '{}',
    "verified_at" TIMESTAMP(3),
    "suspended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "voyageur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(128),
    "email" VARCHAR(128) NOT NULL,
    "tel" VARCHAR(32) NOT NULL,
    "login" VARCHAR(32) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "locale" VARCHAR(32) NOT NULL DEFAULT 'fr-FR',
    "data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bien" (
    "id" BIGSERIAL NOT NULL,
    "id_bailleur" BIGINT NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "area" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "price" VARCHAR(32) NOT NULL,
    "currency" VARCHAR(32) NOT NULL DEFAULT 'eu',
    "data" JSONB NOT NULL DEFAULT '{}',
    "validated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planing" (
    "id" BIGSERIAL NOT NULL,
    "id_bien" BIGINT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "status" VARCHAR(32),
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "planing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" BIGSERIAL NOT NULL,
    "id_bien" BIGINT NOT NULL,
    "id_voyageur" BIGINT NOT NULL,
    -- "id_prestataire" BIGINT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "price" VARCHAR(32) NOT NULL,
    "price_total" VARCHAR(32) NOT NULL,
    "currency" VARCHAR(32) NOT NULL DEFAULT 'eu',
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" BIGSERIAL NOT NULL,
    "id_bien" BIGINT NOT NULL,
    "url" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")

);

-- CreateTable
CREATE TABLE "langue" (
    "id" BIGSERIAL NOT NULL,
    "locale" VARCHAR(32) NOT NULL DEFAULT 'fr-FR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "langue_pkey" PRIMARY KEY ("id")
);


-- AddForeignKey
ALTER TABLE "bien" ADD CONSTRAINT "bien_bailleur_id_fkey" FOREIGN KEY ("id_bailleur") REFERENCES "bailleur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planing" ADD CONSTRAINT "planing_bien_id_fkey" FOREIGN KEY ("id_bien") REFERENCES "bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_bien_id_fkey" FOREIGN KEY ("id_bien") REFERENCES "bien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_voyageur_id_fkey" FOREIGN KEY ("id_voyageur") REFERENCES "voyageur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "location" ADD CONSTRAINT "location_prestataire_id_fkey" FOREIGN KEY ("id_prestataire") REFERENCES "prestataire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
