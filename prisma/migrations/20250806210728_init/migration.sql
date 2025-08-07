-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Company_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `companyId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `dob` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `qrCode` VARCHAR(191) NOT NULL,
    `mcuPackage` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Patient_patientId_key`(`patientId`),
    UNIQUE INDEX `Patient_qrCode_key`(`qrCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `McuResult` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `patientId` INTEGER NOT NULL,
    `pemeriksaanFisikStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `darahLengkapStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `kimiaDarahStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `treadmillStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `tesPsikologiStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `hematologiStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `rontgenThoraxStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `audiometriStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `framinghamScoreStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `urinalisaStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `ekgStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `spirometriStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `McuResult` ADD CONSTRAINT `McuResult_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
