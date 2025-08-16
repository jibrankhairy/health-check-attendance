-- AlterTable
ALTER TABLE `McuResult` ADD COLUMN `framinghamAge` VARCHAR(191) NULL,
    ADD COLUMN `framinghamGender` VARCHAR(191) NULL,
    ADD COLUMN `framinghamHdlCholesterol` VARCHAR(191) NULL,
    ADD COLUMN `framinghamIsOnHypertensionTreatment` VARCHAR(191) NULL,
    ADD COLUMN `framinghamIsSmoker` VARCHAR(191) NULL,
    ADD COLUMN `framinghamRiskCategory` VARCHAR(191) NULL,
    ADD COLUMN `framinghamRiskPercentage` VARCHAR(191) NULL,
    ADD COLUMN `framinghamSystolicBp` VARCHAR(191) NULL,
    ADD COLUMN `framinghamTotalCholesterol` VARCHAR(191) NULL,
    MODIFY `framinghamScore` VARCHAR(191) NULL;
