/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nik` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `nik` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_nik_key` ON `Patient`(`nik`);
