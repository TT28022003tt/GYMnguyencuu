import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed goitap (3 packages: Thường, VIP, PLUS)
  const goitapData = [
    { Ten: 'Thường', Loai: 'Cơ bản', Gia: 500000 },
    { Ten: 'VIP', Loai: 'Cao cấp', Gia: 1000000 },
    { Ten: 'PLUS', Loai: 'Đặc biệt', Gia: 1500000 },
  ];

  for (const gt of goitapData) {
    await prisma.goitap.create({
      data: {
        Ten: gt.Ten,
        Loai: gt.Loai,
        Gia: gt.Gia,
        createdAt: new Date(),
      },
    });
  }

  const usersData = [
    {
      Ten: 'Nguyễn Văn An',
      NgaySinh: new Date('1990-05-15'),
      GioiTinh: 1,
      DiaChi: '123 Đường Láng, Hà Nội',
      SoDienThoai: '0912345678',
      Email: 'an.nguyen@example.com',
      VaiTro: 'trainer',
      TenDangNhap: 'an.nguyen',
      MatKhau: 'password123',
    },
    {
      Ten: 'Trần Thị Bình',
      NgaySinh: new Date('1988-08-20'),
      GioiTinh: 0,
      DiaChi: '456 Lê Lợi, TP.HCM',
      SoDienThoai: '0987654321',
      Email: 'binh.tran@example.com',
      VaiTro: 'trainer',
      TenDangNhap: 'binh.tran',
      MatKhau: 'password123',
    },
    {
      Ten: 'Lê Minh Châu',
      NgaySinh: new Date('1995-03-10'),
      GioiTinh: 0,
      DiaChi: '789 Nguyễn Huệ, Đà Nẵng',
      SoDienThoai: '0901234567',
      Email: 'chau.le@example.com',
      VaiTro: 'HocVien',
      TenDangNhap: 'chau.le',
      MatKhau: 'password123',
    },
    {
      Ten: 'Phạm Quốc Dũng',
      NgaySinh: new Date('1998-07-25'),
      GioiTinh: 1,
      DiaChi: '101 Trần Phú, Hải Phòng',
      SoDienThoai: '0934567890',
      Email: 'dung.pham@example.com',
      VaiTro: 'HocVien',
      TenDangNhap: 'dung.pham',
      MatKhau: 'password123',
    },
    {
      Ten: 'Hoàng Thị Mai',
      NgaySinh: new Date('1997-11-30'),
      GioiTinh: 0,
      DiaChi: '202 Phạm Ngũ Lão, Cần Thơ',
      SoDienThoai: '0923456789',
      Email: 'mai.hoang@example.com',
      VaiTro: 'HocVien',
      TenDangNhap: 'mai.hoang',
      MatKhau: 'password123',
    },
    {
      Ten: 'Vũ Văn Hùng',
      NgaySinh: new Date('1996-01-12'),
      GioiTinh: 1,
      DiaChi: '303 Nguyễn Văn Cừ, Vinh',
      SoDienThoai: '0945678901',
      Email: 'hung.vu@example.com',
      VaiTro: 'HocVien',
      TenDangNhap: 'hung.vu',
      MatKhau: 'password123',
    },
  ];

  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.MatKhau, 10);
    const createdUser = await prisma.user.create({
      data: {
        Ten: user.Ten,
        NgaySinh: user.NgaySinh,
        GioiTinh: user.GioiTinh,
        DiaChi: user.DiaChi,
        SoDienThoai: user.SoDienThoai,
        Email: user.Email,
      },
    });

    await prisma.taikhoan.create({
      data: {
        TenDangNhap: user.TenDangNhap,
        MatKhau: hashedPassword,
        VaiTro: user.VaiTro,
        idUser: createdUser.idUser,
      },
    });

    if (user.VaiTro === 'trainer') {
      await prisma.huanluyenvien.create({
        data: {
          idUser: createdUser.idUser,
          ChungChi: 'ACE Certified',
          BangCap: 'Cử nhân Thể dục thể thao',
          ChuyeMon: 'Gym, Yoga',
          Luong: 15000000,
          createdAt: new Date(),
        },
      });
    } else {
      const goitap = await prisma.goitap.findFirst({
        where: { Ten: ['Thường', 'VIP', 'PLUS'][Math.floor(Math.random() * 3)] },
      });
      const hlv = await prisma.huanluyenvien.findFirst({
        skip: Math.floor(Math.random() * 2),
      });
      await prisma.hocvien.create({
        data: {
          idUSER: createdUser.idUser,
          idMaGT: goitap?.idMaGT,
          MaHLV: hlv?.idMaHLV,
          NgayDangKy: new Date(),
          createdAt: new Date(),
        },
      });
    }
  }

  const lophocData = [
    {
      Ten: 'Yoga Cơ Bản',
      Phong: 'Phòng 1',
      MoTa: 'Lớp yoga giúp thư giãn và tăng cường sức khỏe.',
      TheLoai: 'Yoga',
      SoLuongMax: 20,
      Phi: 300000,
      TrangThai: 'Đang mở',
      ThoiLuong: 60,
      ThoiGianBatDau: new Date('2025-06-01'),
      ThoiGianKetThuc: new Date('2025-08-31'),
    },
    {
      Ten: 'Aerobic Nâng Cao',
      Phong: 'Phòng 2',
      MoTa: 'Lớp aerobic năng động, đốt cháy calo.',
      TheLoai: 'Aerobic',
      SoLuongMax: 15,
      Phi: 350000,
      TrangThai: 'Đang mở',
      ThoiLuong: 45,
      ThoiGianBatDau: new Date('2025-06-01'),
      ThoiGianKetThuc: new Date('2025-08-31'),
    },
    {
      Ten: 'Zumba Sôi Động',
      Phong: 'Phòng 3',
      MoTa: 'Lớp zumba với âm nhạc và vũ điệu Latin.',
      TheLoai: 'Zumba',
      SoLuongMax: 25,
      Phi: 400000,
      TrangThai: 'Đang mở',
      ThoiLuong: 60,
      ThoiGianBatDau: new Date('2025-06-01'),
      ThoiGianKetThuc: new Date('2025-08-31'),
    },
    {
      Ten: 'Boxing Cơ Bản',
      Phong: 'Phòng 4',
      MoTa: 'Lớp boxing tăng cường sức mạnh và phản xạ.',
      TheLoai: 'Boxing',
      SoLuongMax: 10,
      Phi: 500000,
      TrangThai: 'Đang mở',
      ThoiLuong: 90,
      ThoiGianBatDau: new Date('2025-06-01'),
      ThoiGianKetThuc: new Date('2025-08-31'),
    },
    {
      Ten: 'Pilates Cải Thiện Tư Thế',
      Phong: 'Phòng 5',
      MoTa: 'Lớp pilates giúp cải thiện tư thế và sự linh hoạt.',
      TheLoai: 'Pilates',
      SoLuongMax: 12,
      Phi: 450000,
      TrangThai: 'Đang mở',
      ThoiLuong: 60,
      ThoiGianBatDau: new Date('2025-06-01'),
      ThoiGianKetThuc: new Date('2025-08-31'),
    },
  ];

  for (const lh of lophocData) {
    const hlv = await prisma.huanluyenvien.findFirst({
      skip: Math.floor(Math.random() * 2),
    });
    const createdLophoc = await prisma.lophoc.create({
      data: {
        Ten: lh.Ten,
        Phong: lh.Phong,
        MoTa: lh.MoTa,
        TheLoai: lh.TheLoai,
        SoLuongMax: lh.SoLuongMax,
        Phi: lh.Phi,
        TrangThai: lh.TrangThai,
        ThoiLuong: lh.ThoiLuong,
        ThoiGianBatDau: lh.ThoiGianBatDau,
        ThoiGianKetThuc: lh.ThoiGianKetThuc,
        idMaHLV: hlv!.idMaHLV,
        createdAt: new Date(),
      },
    });

    const lichlophocData = [
      { Thu: 2, GioBatDau: '18:00' }, // Tuesday
      { Thu: 4, GioBatDau: '19:00' }, // Thursday
    ];

    for (const llh of lichlophocData) {
      await prisma.lichlophoc.create({
        data: {
          idMaLH: createdLophoc.idMaLH,
          Thu: llh.Thu,
          GioBatDau: llh.GioBatDau,
        },
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });