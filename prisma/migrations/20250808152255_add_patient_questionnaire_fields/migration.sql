-- AlterTable
ALTER TABLE `McuResult` ADD COLUMN `dassTestAnswers` JSON NULL,
    ADD COLUMN `fastTestAnswers` JSON NULL,
    ADD COLUMN `formSubmittedAt` DATETIME(3) NULL,
    ADD COLUMN `healthHistoryAnswers` JSON NULL;
