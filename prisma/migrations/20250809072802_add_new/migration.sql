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
    `gender` VARCHAR(191) NOT NULL,
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
    `status` VARCHAR(191) NOT NULL DEFAULT 'IN_PROGRESS',
    `patientId` INTEGER NOT NULL,
    `healthHistoryAnswers` JSON NULL,
    `dassTestAnswers` JSON NULL,
    `fasTestAnswers` JSON NULL,
    `formSubmittedAt` DATETIME(3) NULL,
    `beratBadan` DOUBLE NULL,
    `tinggiBadan` DOUBLE NULL,
    `bmi` VARCHAR(191) NULL,
    `lingkarPerut` VARCHAR(191) NULL,
    `tekananDarah` VARCHAR(191) NULL,
    `nadi` VARCHAR(191) NULL,
    `suhu` VARCHAR(191) NULL,
    `pernafasan` VARCHAR(191) NULL,
    `fisikKondisiUmum` TEXT NULL,
    `fisikKesadaran` TEXT NULL,
    `fisikKulit` TEXT NULL,
    `fisikKepalaLeher` TEXT NULL,
    `visusOd` VARCHAR(191) NULL,
    `visusOs` VARCHAR(191) NULL,
    `butaWarna` VARCHAR(191) NULL,
    `kacamata` VARCHAR(191) NULL,
    `kacamataOd` VARCHAR(191) NULL,
    `kacamataOs` VARCHAR(191) NULL,
    `lapangPandang` VARCHAR(191) NULL,
    `fisikMataLainnya` TEXT NULL,
    `fisikTelinga` TEXT NULL,
    `fisikHidung` TEXT NULL,
    `fisikTenggorokan` TEXT NULL,
    `fisikKardiovaskular` TEXT NULL,
    `fisikPernafasan` TEXT NULL,
    `fisikPencernaan` TEXT NULL,
    `fisikEkstremitas` TEXT NULL,
    `hemoglobin` TEXT NULL,
    `leukosit` TEXT NULL,
    `trombosit` TEXT NULL,
    `hematokrit` TEXT NULL,
    `eritrosit` TEXT NULL,
    `led` TEXT NULL,
    `mcv` TEXT NULL,
    `mch` TEXT NULL,
    `mchc` TEXT NULL,
    `rdw` TEXT NULL,
    `mpv` TEXT NULL,
    `pdw` TEXT NULL,
    `hitungJenisEosinofil` TEXT NULL,
    `hitungJenisBasofil` TEXT NULL,
    `hitungJenisNeutrofilStab` TEXT NULL,
    `hitungJenisNeutrofilSegmen` TEXT NULL,
    `hitungJenisLimfosit` TEXT NULL,
    `hitungJenisMonosit` TEXT NULL,
    `gulaDarahPuasa` TEXT NULL,
    `gulaDarah2JamPP` TEXT NULL,
    `sgot` TEXT NULL,
    `sgpt` TEXT NULL,
    `asamUrat` TEXT NULL,
    `kolesterolTotal` TEXT NULL,
    `trigliserida` TEXT NULL,
    `ureum` TEXT NULL,
    `kreatinin` TEXT NULL,
    `hdl` TEXT NULL,
    `ldl` TEXT NULL,
    `hbsag` TEXT NULL,
    `bilirubinTotal` TEXT NULL,
    `bilirubinDirect` TEXT NULL,
    `alkaliPhosphatase` TEXT NULL,
    `urinWarna` TEXT NULL,
    `urinKejernihan` TEXT NULL,
    `urinBau` TEXT NULL,
    `urinPh` TEXT NULL,
    `urinBeratJenis` TEXT NULL,
    `urinProtein` TEXT NULL,
    `urinGlukosa` TEXT NULL,
    `urinBilirubin` TEXT NULL,
    `urinUrobilinogen` TEXT NULL,
    `urinKeton` TEXT NULL,
    `urinNitrit` TEXT NULL,
    `urinLeukositEsterase` TEXT NULL,
    `urinBlood` TEXT NULL,
    `urinSedimenEritrosit` TEXT NULL,
    `urinSedimenLeukosit` TEXT NULL,
    `urinSedimenEpitel` TEXT NULL,
    `urinCaOxalat` TEXT NULL,
    `urinUridAcid` TEXT NULL,
    `urinGranulaCast` TEXT NULL,
    `kesanRontgen` TEXT NULL,
    `kesanEkg` TEXT NULL,
    `kesanUsgAbdomen` TEXT NULL,
    `kesanUsgMammae` TEXT NULL,
    `audiometriTelingaKanan` VARCHAR(191) NULL,
    `audiometriTelingaKiri` VARCHAR(191) NULL,
    `kesimpulanAudiometri` TEXT NULL,
    `spirometriFvc` VARCHAR(191) NULL,
    `spirometriFev1` VARCHAR(191) NULL,
    `spirometriFev1Fvc` VARCHAR(191) NULL,
    `kesimpulanSpirometri` TEXT NULL,
    `framinghamScore` VARCHAR(191) NULL,
    `kesimpulanTesPsikologi` TEXT NULL,
    `kesimpulan` TEXT NULL,
    `saran` TEXT NULL,
    `pemeriksaanFisikStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `pemeriksaanFisikPetugas` VARCHAR(191) NULL,
    `darahLengkapStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `darahLengkapPetugas` VARCHAR(191) NULL,
    `kimiaDarahStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `kimiaDarahPetugas` VARCHAR(191) NULL,
    `treadmillStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `treadmillPetugas` VARCHAR(191) NULL,
    `tesPsikologiStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `tesPsikologiPetugas` VARCHAR(191) NULL,
    `hematologiStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `hematologiPetugas` VARCHAR(191) NULL,
    `rontgenThoraxStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `rontgenThoraxPetugas` VARCHAR(191) NULL,
    `audiometriStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `audiometriPetugas` VARCHAR(191) NULL,
    `framinghamScoreStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `framinghamScorePetugas` VARCHAR(191) NULL,
    `urinalisaStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `urinalisaPetugas` VARCHAR(191) NULL,
    `ekgStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `ekgPetugas` VARCHAR(191) NULL,
    `spirometriStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `spirometriPetugas` VARCHAR(191) NULL,
    `usgMammaeStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `usgMammaePetugas` VARCHAR(191) NULL,
    `usgAbdomenStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `usgAbdomenPetugas` VARCHAR(191) NULL,

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
