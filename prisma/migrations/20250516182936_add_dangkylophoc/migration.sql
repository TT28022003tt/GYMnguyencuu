/*
  Warnings:

  - You are about to drop the column `SoLuong` on the `lophoc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `hocvien` MODIFY `MaHLV` INTEGER NULL;

-- AlterTable
ALTER TABLE `lophoc` DROP COLUMN `SoLuong`;

-- CreateTable
CREATE TABLE `dangkylophoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idHocVien` INTEGER NOT NULL,
    `idLopHoc` INTEGER NOT NULL,
    `NgayDangKy` DATETIME(0) NULL,

    INDEX `dangkylophoc_idHocVien_idx`(`idHocVien`),
    INDEX `dangkylophoc_idLopHoc_idx`(`idLopHoc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dangkylophoc` ADD CONSTRAINT `dangkylophoc_idHocVien_fkey` FOREIGN KEY (`idHocVien`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dangkylophoc` ADD CONSTRAINT `dangkylophoc_idLopHoc_fkey` FOREIGN KEY (`idLopHoc`) REFERENCES `lophoc`(`idMaLH`) ON DELETE CASCADE ON UPDATE CASCADE;
