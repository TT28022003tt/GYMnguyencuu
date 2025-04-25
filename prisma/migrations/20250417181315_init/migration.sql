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
    `MoTa` VARCHAR(255) NULL,
    `ThoiGian` VARCHAR(255) NULL,

    INDEX `FK_CTMT_CTT_idx`(`idChuongTrinhTap`),
    PRIMARY KEY (`idChiTietMucTieu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chuongtrinhtap` (
    `idChuongTrinhTap` INTEGER NOT NULL AUTO_INCREMENT,
    `TenCTT` VARCHAR(255) NULL,
    `MucTieu` VARCHAR(255) NULL,
    `MaHV` INTEGER NOT NULL,
    `ThoiGian` VARCHAR(255) NULL,

    INDEX `FK_CTT_HV_idx`(`MaHV`),
    PRIMARY KEY (`idChuongTrinhTap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dangkylophoc` (
    `idDangKyLopHoc` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idMaLH` INTEGER NOT NULL,
    `idMaHV` INTEGER NOT NULL,
    `NgayDangKy` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `MaHV_idx`(`idMaHV`),
    INDEX `MaLH_idx`(`idMaLH`),
    UNIQUE INDEX `dangkylophoc_idMaHV_idMaLH_key`(`idMaHV`, `idMaLH`),
    PRIMARY KEY (`idDangKyLopHoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danhgia` (
    `idMaDG` INTEGER NOT NULL AUTO_INCREMENT,
    `Diem` INTEGER NULL,
    `MoTa` VARCHAR(255) NULL,
    `MaHV` INTEGER NOT NULL,
    `MaHLV` INTEGER NOT NULL,

    INDEX `FK_DanhGia_MaHV_idx`(`MaHV`),
    INDEX `MaHLV_idx`(`MaHLV`),
    PRIMARY KEY (`idMaDG`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `goitap` (
    `idMaGT` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(100) NOT NULL,
    `Loai` VARCHAR(50) NOT NULL,
    `NgayBatDau` DATE NULL,
    `NgayKetThuc` DATE NULL,
    `Gia` DECIMAL(10, 0) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`idMaGT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hocvien` (
    `idMaHV` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaGT` INTEGER NULL,
    `NgayDangKy` DATE NULL,
    `DangKyLopHoc` INTEGER NULL,
    `MaHLV` INTEGER NOT NULL,
    `idUSER` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `FK_HV_HVL_idx`(`MaHLV`),
    INDEX `FK_HV_USER_idx`(`idUSER`),
    INDEX `FK_HocVien_MaGT_idx`(`idMaGT`),
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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

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
CREATE TABLE `lichtap` (
    `MaLT` INTEGER NOT NULL AUTO_INCREMENT,
    `NgayGioBatDau` DATETIME NOT NULL,
    `NgayGioKetThuc` DATETIME NOT NULL,
    `MaHV` INTEGER NOT NULL,
    `MaHLV` INTEGER NOT NULL,
    `idMaLH` INTEGER NULL,
    `idMaCTT` INTEGER NULL,
    `idMaGT` INTEGER NULL,
    `GhiChu` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `FK_LichTap_MaHLV_idx`(`MaHLV`),
    INDEX `FK_LichTap_MaHV_idx`(`MaHV`),
    INDEX `FK_LichTap_MaLH_idx`(`idMaLH`),
    INDEX `FK_LichTap_MaCTT_idx`(`idMaCTT`),
    INDEX `FK_LichTap_MaGT_idx`(`idMaGT`),
    PRIMARY KEY (`MaLT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `baitap` (
    `idBaiTap` INTEGER NOT NULL AUTO_INCREMENT,
    `idLichTap` INTEGER NOT NULL,
    `TenBaiTap` VARCHAR(100) NOT NULL,
    `NhomCo` VARCHAR(50) NULL,
    `MoTa` VARCHAR(255) NULL,
    `SoRep` INTEGER NULL,
    `SoSet` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `BaiTap_LichTap_idx`(`idLichTap`),
    PRIMARY KEY (`idBaiTap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lophoc` (
    `idMaLH` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `Phong` VARCHAR(45) NULL,
    `MoTa` VARCHAR(255) NULL,
    `TheLoai` VARCHAR(45) NULL,
    `SoLuong` INTEGER NULL DEFAULT 0,
    `idMaHLV` INTEGER NOT NULL,
    `monhocIdMaMH` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `MaHLV_idx`(`idMaHLV`),
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

    INDEX `MaHV_idx`(`MaHV`),
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

-- CreateTable
CREATE TABLE `buaan` (
    `idBuaAn` INTEGER NOT NULL AUTO_INCREMENT,
    `idChiTietThucDon` INTEGER NOT NULL,
    `TenBua` VARCHAR(255) NULL,
    `MoTa` VARCHAR(255) NULL,

    INDEX `FK_BA_CTTD_idx`(`idChiTietThucDon`),
    PRIMARY KEY (`idBuaAn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thucdon` (
    `idThucDon` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaHV` INTEGER NOT NULL,
    `TenThucDon` VARCHAR(255) NULL,
    `SoCalo` INTEGER NULL,
    `NgayBatDau` DATE NULL,

    INDEX `FK_HV_TD_idx`(`idMaHV`),
    PRIMARY KEY (`idThucDon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chitietthucdon` (
    `idchitietthucdon` INTEGER NOT NULL AUTO_INCREMENT,
    `idThucDon` INTEGER NOT NULL,
    `Ngay` DATE NULL,

    INDEX `FK_CTTD_TD_idx`(`idThucDon`),
    PRIMARY KEY (`idchitietthucdon`)
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
ALTER TABLE `hocvien` ADD CONSTRAINT `FK_HocVien_MaGT` FOREIGN KEY (`idMaGT`) REFERENCES `goitap`(`idMaGT`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hopdong` ADD CONSTRAINT `FK_HopDong_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `huanluyenvien` ADD CONSTRAINT `FK_HLV_USER` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaLH_idx` FOREIGN KEY (`idMaLH`) REFERENCES `lophoc`(`idMaLH`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaCTT_idx` FOREIGN KEY (`idMaCTT`) REFERENCES `chuongtrinhtap`(`idChuongTrinhTap`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichtap` ADD CONSTRAINT `FK_LichTap_MaGT_idx` FOREIGN KEY (`idMaGT`) REFERENCES `goitap`(`idMaGT`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `baitap` ADD CONSTRAINT `BaiTap_LichTap` FOREIGN KEY (`idLichTap`) REFERENCES `lichtap`(`MaLT`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `FK_LopHoc_MaHLV` FOREIGN KEY (`idMaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `lophoc_monhocIdMaMH_fkey` FOREIGN KEY (`monhocIdMaMH`) REFERENCES `monhoc`(`idMaMH`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `luong` ADD CONSTRAINT `FK_Luong_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanhoi` ADD CONSTRAINT `FK_PhanHoi_MaHLV` FOREIGN KEY (`MaHLV`) REFERENCES `huanluyenvien`(`idMaHLV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanhoi` ADD CONSTRAINT `FK_PhanHoi_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taikhoan` ADD CONSTRAINT `FK_TK_USER` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanhtoan` ADD CONSTRAINT `FK_ThanhToan_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thehoivien` ADD CONSTRAINT `FK_TheHoiVien_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tuvanhotro` ADD CONSTRAINT `FK_TVHT_MaHV` FOREIGN KEY (`MaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buaan` ADD CONSTRAINT `FK_BA_CTTD` FOREIGN KEY (`idChiTietThucDon`) REFERENCES `chitietthucdon`(`idchitietthucdon`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thucdon` ADD CONSTRAINT `FK_HV_TD` FOREIGN KEY (`idMaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chitietthucdon` ADD CONSTRAINT `FK_CTTD_TD` FOREIGN KEY (`idThucDon`) REFERENCES `thucdon`(`idThucDon`) ON DELETE CASCADE ON UPDATE CASCADE;
