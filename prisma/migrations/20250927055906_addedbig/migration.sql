/*
  Warnings:

  - You are about to drop the column `fisikValidatorName` on the `McuResult` table. All the data in the column will be lost.
  - You are about to drop the column `fisikValidatorQr` on the `McuResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `McuResult` DROP COLUMN `fisikValidatorName`,
    DROP COLUMN `fisikValidatorQr`;
