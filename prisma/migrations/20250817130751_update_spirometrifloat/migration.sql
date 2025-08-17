/*
  Warnings:

  - You are about to alter the column `spirometriFvc` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev1` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev1Fvc` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef25` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef2575` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef2575Pred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef25Post` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef25Pred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef50` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef50Post` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef50Pred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef75` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef75Post` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFef75Pred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev1FvcPred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev1Post` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev1Pred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev6` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFev6Pred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFvcPost` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriFvcPred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriPef` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriPefPost` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.
  - You are about to alter the column `spirometriPefPred` on the `McuResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Double`.

*/
-- AlterTable
ALTER TABLE `McuResult` MODIFY `spirometriFvc` DOUBLE NULL,
    MODIFY `spirometriFev1` DOUBLE NULL,
    MODIFY `spirometriFev1Fvc` DOUBLE NULL,
    MODIFY `spirometriFef25` DOUBLE NULL,
    MODIFY `spirometriFef2575` DOUBLE NULL,
    MODIFY `spirometriFef2575Pred` DOUBLE NULL,
    MODIFY `spirometriFef25Post` DOUBLE NULL,
    MODIFY `spirometriFef25Pred` DOUBLE NULL,
    MODIFY `spirometriFef50` DOUBLE NULL,
    MODIFY `spirometriFef50Post` DOUBLE NULL,
    MODIFY `spirometriFef50Pred` DOUBLE NULL,
    MODIFY `spirometriFef75` DOUBLE NULL,
    MODIFY `spirometriFef75Post` DOUBLE NULL,
    MODIFY `spirometriFef75Pred` DOUBLE NULL,
    MODIFY `spirometriFev1FvcPred` DOUBLE NULL,
    MODIFY `spirometriFev1Post` DOUBLE NULL,
    MODIFY `spirometriFev1Pred` DOUBLE NULL,
    MODIFY `spirometriFev6` DOUBLE NULL,
    MODIFY `spirometriFev6Pred` DOUBLE NULL,
    MODIFY `spirometriFvcPost` DOUBLE NULL,
    MODIFY `spirometriFvcPred` DOUBLE NULL,
    MODIFY `spirometriPef` DOUBLE NULL,
    MODIFY `spirometriPefPost` DOUBLE NULL,
    MODIFY `spirometriPefPred` DOUBLE NULL;
