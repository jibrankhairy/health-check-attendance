/*
  Warnings:

  - You are about to drop the column `ekgImage` on the `McuResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `McuResult` DROP COLUMN `ekgImage`,
    ADD COLUMN `ekgImage1` TEXT NULL,
    ADD COLUMN `ekgImage2` TEXT NULL,
    ADD COLUMN `ekgImage3` TEXT NULL;
