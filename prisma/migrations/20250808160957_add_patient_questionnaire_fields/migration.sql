/*
  Warnings:

  - You are about to drop the column `fastTestAnswers` on the `McuResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `McuResult` DROP COLUMN `fastTestAnswers`,
    ADD COLUMN `fasTestAnswers` JSON NULL;
