-- AlterTable
ALTER TABLE `McuResult` ADD COLUMN `isExcelDataImported` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isImagesUploaded` BOOLEAN NOT NULL DEFAULT false;
