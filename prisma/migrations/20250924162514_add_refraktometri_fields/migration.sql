-- AlterTable
ALTER TABLE `McuResult` ADD COLUMN `refraKananAdd` TEXT NULL,
    ADD COLUMN `refraKananAxis` TEXT NULL,
    ADD COLUMN `refraKananChylinder` TEXT NULL,
    ADD COLUMN `refraKananSpheris` TEXT NULL,
    ADD COLUMN `refraKiriAdd` TEXT NULL,
    ADD COLUMN `refraKiriAxis` TEXT NULL,
    ADD COLUMN `refraKiriChylinder` TEXT NULL,
    ADD COLUMN `refraKiriSpheris` TEXT NULL,
    ADD COLUMN `refraValidatorName` VARCHAR(191) NULL,
    ADD COLUMN `refraValidatorQr` TEXT NULL;
