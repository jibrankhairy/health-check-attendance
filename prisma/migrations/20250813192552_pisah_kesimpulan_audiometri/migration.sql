/*
  Warnings:

  - You are about to drop the column `kesimpulanAudiometri` on the `McuResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `McuResult` DROP COLUMN `kesimpulanAudiometri`,
    ADD COLUMN `audiometriKesimpulanTelingaKanan` TEXT NULL,
    ADD COLUMN `audiometriKesimpulanTelingaKiri` TEXT NULL,
    ADD COLUMN `audiometriKesimpulanUmum` TEXT NULL,
    ADD COLUMN `audiometriSaran` TEXT NULL;
