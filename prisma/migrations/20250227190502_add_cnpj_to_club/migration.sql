/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "cnpj" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Club_cnpj_key" ON "Club"("cnpj");
