-- CreateTable
CREATE TABLE `chitietkhuyenmai` (
    `idMaChiTietKM` INTEGER NOT NULL,
    `Ten` VARCHAR(45) NULL,
    `LoaiSP` VARCHAR(45) NULL,
    `SoLuong` VARCHAR(45) NULL,
    `NgayBatDauKM` DATE NULL,
    `NgayKetThucKM` DATE NULL,
    `MaKM` INTEGER NOT NULL,

    INDEX `MaKM_idx`(`MaKM`),
    PRIMARY KEY (`idMaChiTietKM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chitietmuctieu` (
    `idChiTietMucTieu` INTEGER NOT NULL AUTO_INCREMENT,
    `idChuongTrinhTap` INTEGER NOT NULL,
    `ThoiGian` VARCHAR(255) NULL,
    `MoTa` VARCHAR(255) NULL,

    INDEX `FK_CTMT_CTT_idx`(`idChuongTrinhTap`),
    PRIMARY KEY (`idChiTietMucTieu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chuongtrinhtap` (
    `idChuongTrinhTap` INTEGER NOT NULL AUTO_INCREMENT,
    `TenCTT` VARCHAR(255) NULL,
    `MucTieu` VARCHAR(255) NULL,
    `ThoiGian` VARCHAR(255) NULL,
    `MaHV` INTEGER NOT NULL,

    INDEX `FK_CTT_HV_idx`(`MaHV`),
    PRIMARY KEY (`idChuongTrinhTap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dangkylophoc` (
    `idDangKyLopHoc` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idMaLH` INTEGER NOT NULL,
    `idMaHV` INTEGER NOT NULL,

    INDEX `MaHV_idx`(`idMaHV`),
    INDEX `MaLH_idx`(`idMaLH`),
    PRIMARY KEY (`idDangKyLopHoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danhgia` (
    `idMaDG` INTEGER NOT NULL AUTO_INCREMENT,
    `Diem` INTEGER NULL,
    `MoTa` VARCHAR(255) NULL,
    `MaHV` INTEGER NOT NULL,
    `MaHLV` INTEGER NOT NULL,

    INDEX `FK_DanhGia_MaHV`(`MaHV`),
    INDEX `MaHLV_idx`(`MaHLV`),
    PRIMARY KEY (`idMaDG`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `goitap` (
    `idMaGT` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `ThoiGian` INTEGER NULL,
    `Gia` DECIMAL(10, 0) NULL,

    PRIMARY KEY (`idMaGT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hocvien` (
    `idMaHV` INTEGER NOT NULL AUTO_INCREMENT,
    `GoiTap` VARCHAR(45) NULL,
    `NgayDangKy` DATE NULL,
    `DangKyLopHoc` INTEGER NULL,
    `MaHLV` INTEGER NOT NULL,
    `idUSER` INTEGER NOT NULL,

    INDEX `FK_HV_HVL_idx`(`MaHLV`),
    INDEX `FK_HV_USER_idx`(`idUSER`),
    PRIMARY KEY (`idMaHV`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hopdong` (
    `idMaHD` INTEGER NOT NULL AUTO_INCREMENT,
    `NgayKy` DATE NULL,
    `ThoiHan` INTEGER NULL,
    `TinhTrang` VARCHAR(45) NULL,
    `MaHV` INTEGER NOT NULL,

    INDEX `MaHV_idx`(`MaHV`),
    PRIMARY KEY (`idMaHD`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `huanluyenvien` (
    `idMaHLV` INTEGER NOT NULL AUTO_INCREMENT,
    `ChungChi` VARCHAR(45) NULL,
    `BangCap` VARCHAR(45) NULL,
    `ChuyeMon` VARCHAR(45) NULL,
    `Luong` DECIMAL(10, 2) NULL,
    `idUser` INTEGER NOT NULL,

    UNIQUE INDEX `idMaHLV_UNIQUE`(`idMaHLV`),
    INDEX `FK_HLV_USER_idx`(`idUser`),
    PRIMARY KEY (`idMaHLV`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khuyenmai` (
    `idMaKM` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `PhanTramGia` INTEGER NULL,
    `NgayBatDau` DATE NULL,
    `NgayKetThuc` DATE NULL,
    `MoTa` VARCHAR(255) NULL,

    PRIMARY KEY (`idMaKM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lichlamviec` (
    `idMaLich` INTEGER NOT NULL AUTO_INCREMENT,
    `Ngay` DATE NULL,
    `CaLam` VARCHAR(45) NULL,
    `MaHLV` INTEGER NOT NULL,

    INDEX `MaHLV_idx`(`MaHLV`),
    PRIMARY KEY (`idMaLich`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lichtap` (
    `MaLT` INTEGER NOT NULL AUTO_INCREMENT,
    `GoiTap` VARCHAR(45) NULL,
    `NgayTap` VARCHAR(45) NULL,
    `MaNV` INTEGER NOT NULL,
    `MaHV` INTEGER NOT NULL,
    `MaHLV` INTEGER NOT NULL,

    INDEX `FK_LichTap_MaHLV_idx`(`MaHLV`),
    INDEX `FK_LichTap_MaHV_idx`(`MaHV`),
    PRIMARY KEY (`MaLT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loailophoc` (
    `idMaLLH` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `ThoiGian` VARCHAR(45) NULL,
    `Chung` VARCHAR(45) NULL,
    `Rieng` VARCHAR(45) NULL,
    `MaHLV` INTEGER NOT NULL,
    `MaLH` INTEGER NOT NULL,

    INDEX `MaHLV_idx`(`MaHLV`),
    INDEX `MaLH_idx`(`MaLH`),
    PRIMARY KEY (`idMaLLH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lophoc` (
    `idMaLH` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `Phong` VARCHAR(45) NULL,
    `Tang` VARCHAR(45) NULL,
    `MoTa` VARCHAR(255) NULL,
    `TheLoai` VARCHAR(45) NULL,
    `SoLuong` VARCHAR(45) NULL,
    `Rieng` VARCHAR(45) NULL,
    `Chung` VARCHAR(45) NULL,
    `idMaMH` INTEGER NOT NULL,
    `idMaHLV` INTEGER NOT NULL,

    INDEX `MaHLV_idx`(`idMaHLV`),
    INDEX `MaMH_idx`(`idMaMH`),
    PRIMARY KEY (`idMaLH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `luong` (
    `MaL` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `LuongCoBan` VARCHAR(45) NULL,
    `PhuCap` VARCHAR(45) NULL,
    `Thuong` VARCHAR(45) NULL,
    `MaHLV` INTEGER NOT NULL,

    INDEX `MaHLV_idx`(`MaHLV`),
    PRIMARY KEY (`MaL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monhoc` (
    `idMaMH` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `Lop` VARCHAR(45) NULL,
    `SoLuong` VARCHAR(45) NULL,
    `CoSo` VARCHAR(45) NULL,
    `Phong` VARCHAR(45) NULL,

    PRIMARY KEY (`idMaMH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phanhoi` (
    `idMaPH` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `GhiChu` VARCHAR(45) NULL,
    `NgayPhanHoi` DATE NULL,
    `LyDo` VARCHAR(45) NULL,
    `MaHV` INTEGER NOT NULL,
    `MaHLV` INTEGER NOT NULL,

    INDEX `MaHLV_idx`(`MaHLV`),
    INDEX `MaHV_idx`(`MaHV`),
    PRIMARY KEY (`idMaPH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suathoc` (
    `idSuatHoc` INTEGER NOT NULL AUTO_INCREMENT,
    `HoTen` VARCHAR(255) NULL,
    `Lop` VARCHAR(255) NULL,
    `Phong` VARCHAR(255) NULL,
    `CoSo` VARCHAR(255) NULL,
    `Loai` VARCHAR(255) NULL,
    `idMaLLH` INTEGER NOT NULL,
    `idMaLH` INTEGER NOT NULL,

    INDEX `FK_SH_LH_idx`(`idMaLH`),
    INDEX `FK_SH_LLH_idx`(`idMaLLH`),
    PRIMARY KEY (`idSuatHoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taikhoan` (
    `idMaTK` INTEGER NOT NULL AUTO_INCREMENT,
    `TenDangNhap` VARCHAR(255) NULL,
    `MatKhau` VARCHAR(255) NULL,
    `VaiTro` VARCHAR(45) NULL,
    `idUser` INTEGER NOT NULL,
    `token` VARCHAR(255) NULL,

    UNIQUE INDEX `taikhoan_TenDangNhap_key`(`TenDangNhap`),
    INDEX `FK_TK_USER_idx`(`idUser`),
    PRIMARY KEY (`idMaTK`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thanhtoan` (
    `idThanhToan` INTEGER NOT NULL AUTO_INCREMENT,
    `idHoaDon` INTEGER NULL,
    `PhuongThucThanhToan` VARCHAR(45) NULL,
    `NgayThanhToan` DECIMAL(10, 2) NULL,
    `MoTa` VARCHAR(45) NULL,
    `MaHV` INTEGER NOT NULL,

    INDEX `FK_ThanhToan_MaHV_idx`(`MaHV`),
    PRIMARY KEY (`idThanhToan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thehoivien` (
    `idMaThe` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `NgayCap` DATE NULL,
    `NgayHetHan` DATE NULL,
    `TinhTrang` VARCHAR(45) NULL,
    `MaHV` INTEGER NOT NULL,

    INDEX `MaHV`(`MaHV`),
    PRIMARY KEY (`idMaThe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tuvanhotro` (
    `idTuVanHoTro` INTEGER NOT NULL AUTO_INCREMENT,
    `NoiDung` VARCHAR(45) NULL,
    `HinhThuc` VARCHAR(45) NULL,
    `TrangThai` VARCHAR(45) NULL,
    `MaHV` INTEGER NOT NULL,

    INDEX `MaKH_idx`(`MaHV`),
    PRIMARY KEY (`idTuVanHoTro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `NgaySinh` DATE NULL,
    `GioiTinh` TINYINT NULL DEFAULT 1,
    `DiaChi` VARCHAR(255) NULL,
    `SoDienThoai` VARCHAR(45) NULL,
    `Email` VARCHAR(45) NULL,

    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chitietkhuyenmai` ADD CONSTRAINT `FK_CTKM_MaKM` FOREIGN KEY (`MaKM`) REFERENCES `khuyenmai`(`idMaKM`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chitietmuctieu` ADD CONSTRAINT `FK_CTMT_CTT` FOREIGN KEY (`idChuongTrinhTap`) REFERENCES `chuongtrinhtap`(`idChuongTrinhTap`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chuongtrinhtap` ADD CONSTRAINT `FK_CTT_HV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dangkylophoc` ADD CONSTRAINT `FK_DKLH_MaHV` FOREIGN KEY (`idMaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dangkylophoc` ADD CONSTRAINT `FK_DKLH_MaLH` FOREIGN KEY (`idMaLH`) REFERENCES `lophoc`(`idMaLH`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danhgia` ADD CONSTRAINT `FK_DanhGia_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danhgia` ADD CONSTRAINT `FK_DanhGia_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien` ADD CONSTRAINT `FK_HV_HVL` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien` ADD CONSTRAINT `FK_HV_USER` FOREIGN KEY (`idUSER`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hopdong` ADD CONSTRAINT `FK_HopDong_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `huanluyenvien` ADD CONSTRAINT `FK_HLV_USER` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichlamviec` ADD CONSTRAINT `FK_LichLamViec_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loailophoc` ADD CONSTRAINT `FK_LLH_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loailophoc` ADD CONSTRAINT `FK_LLH_MaLH` FOREIGN KEY (`MaLH`) REFERENCES `lophoc`(`idMaLH`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `FK_LopHoc_MaHLV` FOREIGN KEY (`idMaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `FK_LopHoc_MaMH` FOREIGN KEY (`idMaMH`) REFERENCES `monhoc`(`idMaMH`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `luong` ADD CONSTRAINT `FK_Luong_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanhoi` ADD CONSTRAINT `FK_PhanHoi_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanhoi` ADD CONSTRAINT `FK_PhanHoi_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suathoc` ADD CONSTRAINT `FK_SH_LH` FOREIGN KEY (`idMaLH`) REFERENCES `lophoc`(`idMaLH`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suathoc` ADD CONSTRAINT `FK_SH_LLH` FOREIGN KEY (`idMaLLH`) REFERENCES `loailophoc`(`idMaLLH`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `taikhoan` ADD CONSTRAINT `FK_TK_USER` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanhtoan` ADD CONSTRAINT `FK_ThanhToan_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thehoivien` ADD CONSTRAINT `FK_TheHoiVien_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tuvanhotro` ADD CONSTRAINT `FK_TVHT_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;
