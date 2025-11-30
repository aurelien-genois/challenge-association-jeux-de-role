-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_sheet" (
    "id" SERIAL NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'draft',
    "name" VARCHAR(50) NOT NULL,
    "age" DECIMAL(5,0) NOT NULL,
    "physical_desc" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "character_sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characteristic" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "characteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_has_characteristic" (
    "game_id" INTEGER NOT NULL,
    "characteristic_id" INTEGER NOT NULL,

    CONSTRAINT "game_has_characteristic_pkey" PRIMARY KEY ("game_id","characteristic_id")
);

-- CreateTable
CREATE TABLE "character_has_characteristic" (
    "character_sheet_id" INTEGER NOT NULL,
    "characteristic_id" INTEGER NOT NULL,

    CONSTRAINT "character_has_characteristic_pkey" PRIMARY KEY ("character_sheet_id","characteristic_id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_has_skill" (
    "character_sheet_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "character_has_skill_pkey" PRIMARY KEY ("character_sheet_id","skill_id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "character_sheet_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "nb" DECIMAL(2,0) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("character_sheet_id","item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "game_title_key" ON "game"("title");

-- CreateIndex
CREATE UNIQUE INDEX "characteristic_name_key" ON "characteristic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_name_key" ON "job"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- AddForeignKey
ALTER TABLE "character_sheet" ADD CONSTRAINT "character_sheet_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_sheet" ADD CONSTRAINT "character_sheet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_sheet" ADD CONSTRAINT "character_sheet_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_has_characteristic" ADD CONSTRAINT "game_has_characteristic_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_has_characteristic" ADD CONSTRAINT "game_has_characteristic_characteristic_id_fkey" FOREIGN KEY ("characteristic_id") REFERENCES "characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_has_characteristic" ADD CONSTRAINT "character_has_characteristic_character_sheet_id_fkey" FOREIGN KEY ("character_sheet_id") REFERENCES "character_sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_has_characteristic" ADD CONSTRAINT "character_has_characteristic_characteristic_id_fkey" FOREIGN KEY ("characteristic_id") REFERENCES "characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_has_skill" ADD CONSTRAINT "character_has_skill_character_sheet_id_fkey" FOREIGN KEY ("character_sheet_id") REFERENCES "character_sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_has_skill" ADD CONSTRAINT "character_has_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_character_sheet_id_fkey" FOREIGN KEY ("character_sheet_id") REFERENCES "character_sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
