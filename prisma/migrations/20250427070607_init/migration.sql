/*
  Warnings:

  - You are about to drop the column `monhocIdMaMH` on the `lophoc` table. All the data in the column will be lost.
  - You are about to drop the `monhoc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `lophoc` DROP FOREIGN KEY `lophoc_monhocIdMaMH_fkey`;

-- DropIndex
DROP INDEX `lophoc_monhocIdMaMH_fkey` ON `lophoc`;

-- AlterTable
ALTER TABLE `chitietmuctieu` MODIFY `MoTa` TEXT NULL;

-- AlterTable
ALTER TABLE `lophoc` DROP COLUMN `monhocIdMaMH`,
    ADD COLUMN `ThoiGianBatDau` DATETIME(0) NULL;

-- DropTable
DROP TABLE `monhoc`;
