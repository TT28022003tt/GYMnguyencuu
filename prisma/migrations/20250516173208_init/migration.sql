/*
  Warnings:

  - You are about to drop the column `NgayBatDau` on the `goitap` table. All the data in the column will be lost.
  - You are about to drop the column `NgayKetThuc` on the `goitap` table. All the data in the column will be lost.
  - You are about to drop the column `DangKyLopHoc` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `GhiChu` on the `phanhoi` table. All the data in the column will be lost.
  - You are about to drop the column `LyDo` on the `phanhoi` table. All the data in the column will be lost.
  - You are about to drop the column `MaHLV` on the `phanhoi` table. All the data in the column will be lost.
  - You are about to drop the column `MaHV` on the `phanhoi` table. All the data in the column will be lost.
  - You are about to drop the column `NgayPhanHoi` on the `phanhoi` table. All the data in the column will be lost.
  - You are about to drop the column `Ten` on the `phanhoi` table. All the data in the column will be lost.
  - You are about to drop the `dangkylophoc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idUser` to the `phanhoi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dangkylophoc` DROP FOREIGN KEY `FK_DKLH_MaHV`;

-- DropForeignKey
ALTER TABLE `dangkylophoc` DROP FOREIGN KEY `FK_DKLH_MaLH`;

-- DropForeignKey
ALTER TABLE `phanhoi` DROP FOREIGN KEY `FK_PhanHoi_MaHLV`;

-- DropForeignKey
ALTER TABLE `phanhoi` DROP FOREIGN KEY `FK_PhanHoi_MaHV`;

-- DropIndex
DROP INDEX `MaHLV_idx` ON `phanhoi`;

-- DropIndex
DROP INDEX `MaHV_idx` ON `phanhoi`;

-- AlterTable
ALTER TABLE `goitap` DROP COLUMN `NgayBatDau`,
    DROP COLUMN `NgayKetThuc`;

-- AlterTable
ALTER TABLE `hocvien` DROP COLUMN `DangKyLopHoc`;

-- AlterTable
ALTER TABLE `lichtap` ADD COLUMN `TinhTrang` VARCHAR(20) NULL DEFAULT 'Ongoing';

-- AlterTable
ALTER TABLE `lophoc` ADD COLUMN `Phi` DECIMAL(10, 2) NULL,
    ADD COLUMN `SoLuongMax` INTEGER NULL DEFAULT 0,
    ADD COLUMN `ThoiGianKetThuc` DATE NULL,
    ADD COLUMN `ThoiLuong` INTEGER NULL,
    ADD COLUMN `TrangThai` VARCHAR(255) NULL,
    MODIFY `Ten` VARCHAR(255) NULL,
    MODIFY `Phong` VARCHAR(255) NULL,
    ALTER COLUMN `SoLuong` DROP DEFAULT,
    MODIFY `ThoiGianBatDau` DATE NULL;

-- AlterTable
ALTER TABLE `phanhoi` DROP COLUMN `GhiChu`,
    DROP COLUMN `LyDo`,
    DROP COLUMN `MaHLV`,
    DROP COLUMN `MaHV`,
    DROP COLUMN `NgayPhanHoi`,
    DROP COLUMN `Ten`,
    ADD COLUMN `LoaiPhanHoi` VARCHAR(255) NULL,
    ADD COLUMN `NgayTao` DATETIME(0) NULL,
    ADD COLUMN `NoiDung` LONGTEXT NULL,
    ADD COLUMN `SoSao` TINYINT NULL DEFAULT 5,
    ADD COLUMN `idUser` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `Anh` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `dangkylophoc`;

-- CreateTable
CREATE TABLE `chatmessage` (
    `idchatmessage` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `Text` LONGTEXT NULL,
    `Timestamp` DATETIME(0) NULL,
    `from` VARCHAR(255) NULL,

    INDEX `FK_CM_User _idx`(`idUser`),
    PRIMARY KEY (`idchatmessage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chitietgoitap` (
    `idchitietgoitap` INTEGER NOT NULL,
    `SoThang` INTEGER NULL,
    `TongTien` DECIMAL(10, 0) NULL,
    `NgayDangKy` DATE NULL,
    `NgayHetHan` DATE NULL,
    `idMaGT` INTEGER NOT NULL,
    `idUser` INTEGER NOT NULL,
    `TinhTrang` TINYINT NULL DEFAULT 1,

    INDEX `FK_CTGT_GT_idx`(`idMaGT`),
    INDEX `FK_CTGT_User_idx`(`idUser`),
    PRIMARY KEY (`idchitietgoitap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lichlophoc` (
    `idLichLopHoc` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaLH` INTEGER NOT NULL,
    `Thu` INTEGER NULL,
    `GioBatDau` VARCHAR(5) NULL,

    INDEX `FK_LLH_LH_idx`(`idMaLH`),
    PRIMARY KEY (`idLichLopHoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `FK_PhanHoi_User_idx` ON `phanhoi`(`idUser`);

-- AddForeignKey
ALTER TABLE `phanhoi` ADD CONSTRAINT `FK_PhanHoi_User` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatmessage` ADD CONSTRAINT `FK_CM_User` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chitietgoitap` ADD CONSTRAINT `FK_CTGT_GT` FOREIGN KEY (`idMaGT`) REFERENCES `goitap`(`idMaGT`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chitietgoitap` ADD CONSTRAINT `FK_CTGT_User` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichlophoc` ADD CONSTRAINT `FK_LLH_LH` FOREIGN KEY (`idMaLH`) REFERENCES `lophoc`(`idMaLH`) ON DELETE CASCADE ON UPDATE CASCADE;
