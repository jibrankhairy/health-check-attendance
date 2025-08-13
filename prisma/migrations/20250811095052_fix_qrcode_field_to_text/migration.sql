-- DropIndex
DROP INDEX `Patient_qrCode_key` ON `Patient`;

-- AlterTable
ALTER TABLE `Patient` MODIFY `qrCode` TEXT NOT NULL;
