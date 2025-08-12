/*
  Warnings:

  - You are about to drop the column `audiometriTelingaKanan` on the `McuResult` table. All the data in the column will be lost.
  - You are about to drop the column `audiometriTelingaKiri` on the `McuResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `McuResult` DROP COLUMN `audiometriTelingaKanan`,
    DROP COLUMN `audiometriTelingaKiri`,
    ADD COLUMN `audioAcKanan1000` INTEGER NULL,
    ADD COLUMN `audioAcKanan2000` INTEGER NULL,
    ADD COLUMN `audioAcKanan250` INTEGER NULL,
    ADD COLUMN `audioAcKanan3000` INTEGER NULL,
    ADD COLUMN `audioAcKanan4000` INTEGER NULL,
    ADD COLUMN `audioAcKanan500` INTEGER NULL,
    ADD COLUMN `audioAcKanan6000` INTEGER NULL,
    ADD COLUMN `audioAcKanan8000` INTEGER NULL,
    ADD COLUMN `audioAcKiri1000` INTEGER NULL,
    ADD COLUMN `audioAcKiri2000` INTEGER NULL,
    ADD COLUMN `audioAcKiri250` INTEGER NULL,
    ADD COLUMN `audioAcKiri3000` INTEGER NULL,
    ADD COLUMN `audioAcKiri4000` INTEGER NULL,
    ADD COLUMN `audioAcKiri500` INTEGER NULL,
    ADD COLUMN `audioAcKiri6000` INTEGER NULL,
    ADD COLUMN `audioAcKiri8000` INTEGER NULL,
    ADD COLUMN `audioBcKanan1000` INTEGER NULL,
    ADD COLUMN `audioBcKanan2000` INTEGER NULL,
    ADD COLUMN `audioBcKanan250` INTEGER NULL,
    ADD COLUMN `audioBcKanan3000` INTEGER NULL,
    ADD COLUMN `audioBcKanan4000` INTEGER NULL,
    ADD COLUMN `audioBcKanan500` INTEGER NULL,
    ADD COLUMN `audioBcKanan6000` INTEGER NULL,
    ADD COLUMN `audioBcKanan8000` INTEGER NULL,
    ADD COLUMN `audioBcKiri1000` INTEGER NULL,
    ADD COLUMN `audioBcKiri2000` INTEGER NULL,
    ADD COLUMN `audioBcKiri250` INTEGER NULL,
    ADD COLUMN `audioBcKiri3000` INTEGER NULL,
    ADD COLUMN `audioBcKiri4000` INTEGER NULL,
    ADD COLUMN `audioBcKiri500` INTEGER NULL,
    ADD COLUMN `audioBcKiri6000` INTEGER NULL,
    ADD COLUMN `audioBcKiri8000` INTEGER NULL;
