-- AlterTable
ALTER TABLE `chuongtrinhtap` ADD COLUMN `TrangThai` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `advancedmetrics` (
    `idAdvancedMetrics` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaHV` INTEGER NOT NULL,
    `BodyFatPercent` FLOAT NULL,
    `MuscleMass` FLOAT NULL,
    `VisceralFat` FLOAT NULL,
    `BasalMetabolicRate` FLOAT NULL,
    `BoneMass` FLOAT NULL,
    `WaterPercent` FLOAT NULL,
    `Mota` VARCHAR(255) NULL,

    INDEX `FK_advancedmetrics_HV_idx`(`idMaHV`),
    PRIMARY KEY (`idAdvancedMetrics`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `basicmetrics` (
    `idBasicMetrics` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaHV` INTEGER NOT NULL,
    `Height` FLOAT NULL,
    `Weight` FLOAT NULL,
    `BMI` FLOAT NULL,
    `Chest` FLOAT NULL,
    `Waist` FLOAT NULL,
    `hips` FLOAT NULL,
    `Arm` FLOAT NULL,
    `Thigh` FLOAT NULL,
    `Calf` FLOAT NULL,
    `Mota` VARCHAR(255) NULL,

    INDEX `FK_basicmetrics_HV_idx`(`idMaHV`),
    PRIMARY KEY (`idBasicMetrics`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `advancedmetrics` ADD CONSTRAINT `FK_advancedmetrics_HV` FOREIGN KEY (`idMaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `basicmetrics` ADD CONSTRAINT `FK_basicmetrics_HV` FOREIGN KEY (`idMaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;
