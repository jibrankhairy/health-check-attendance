/*
  Warnings:

  - You are about to drop the column `framinghamGender` on the `McuResult` table. All the data in the column will be lost.
  - You are about to drop the column `framinghamScore` on the `McuResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `McuResult` DROP COLUMN `framinghamGender`,
    DROP COLUMN `framinghamScore`,
    ADD COLUMN `framinghamVascularAge` VARCHAR(191) NULL;
