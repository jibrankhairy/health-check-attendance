/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mcuPackage` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `department` VARCHAR(191) NOT NULL,
    ADD COLUMN `dob` DATETIME(3) NOT NULL,
    ADD COLUMN `mcuPackage` JSON NOT NULL,
    ADD COLUMN `qrCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_qrCode_key` ON `Patient`(`qrCode`);
