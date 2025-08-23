-- AlterTable
ALTER TABLE `McuResult` ADD COLUMN `treadmillHasilTest` TEXT NULL,
    ADD COLUMN `treadmillImage1` TEXT NULL,
    ADD COLUMN `treadmillImage2` TEXT NULL,
    ADD COLUMN `treadmillImage3` TEXT NULL,
    ADD COLUMN `treadmillKelasFungsional` TEXT NULL,
    ADD COLUMN `treadmillKerjaFisik` TEXT NULL,
    ADD COLUMN `treadmillKlasifikasiKebugaran` TEXT NULL,
    ADD COLUMN `treadmillLamaLatihan` TEXT NULL,
    ADD COLUMN `treadmillSaran` TEXT NULL,
    ADD COLUMN `treadmillValidatorName` VARCHAR(191) NULL,
    ADD COLUMN `treadmillValidatorQr` TEXT NULL;
