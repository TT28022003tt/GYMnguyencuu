import Image from "next/image";
import Link from "next/link";
import prisma from "../../../../../../prisma/client";

interface MembershipDetailProps {
  params: { id: string };
}

const MembershipDetail = async ({ params }: MembershipDetailProps) => {
  const idUser = parseInt(params.id);

  const member = await prisma.hocvien.findFirst({
    where: { idUSER: idUser },
    include: {
      user: {
        select: {
          Ten: true,
          Email: true,
          SoDienThoai: true,
          Anh: true,
          NgaySinh: true,
          GioiTinh: true,
          DiaChi: true,
        },
      },
      huanluyenvien: {
        include: {
          user: { select: { Ten: true } },
        },
        select: {
          ChungChi: true,
          BangCap: true,
          ChuyeMon: true,
        },
      },
      goitap: {
        select: {
          Ten: true,
          Loai: true,
          Gia: true,
          chitietgoitap: {
            where: { idUser },
            select: {
              SoThang: true,
              TongTien: true,
              NgayDangKy: true,
              NgayHetHan: true,
              TinhTrang: true,
            },
          },
        },
      },
    },
  });

  if (!member) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Hội viên không tồn tại</h1>
        <Link href="/listManagement/membership" className="text-blue-500 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const chitietgoitap = member.goitap?.chitietgoitap[0];

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Chi Tiết Hội Viên</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Member Info */}
        <div>
          <div className="flex items-center mb-4">
            <Image
              src={member.user?.Anh || "/images/default-avatar.png"}
              alt={member.user?.Ten || "N/A"}
              width={60}
              height={60}
              className="w-15 h-15 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="text-lg font-semibold">{member.user?.Ten || "N/A"}</h2>
              <p className="text-sm text-gray-500">Email: {member.user?.Email || "N/A"}</p>
              <p className="text-sm text-gray-500">Số điện thoại: {member.user?.SoDienThoai || "N/A"}</p>
            </div>
          </div>
          <p className="mb-2">
            <span className="font-medium">Mã Hội Viên:</span> {member.idMaHV}
          </p>
          <p className="mb-2">
            <span className="font-medium">Ngày Đăng Ký:</span>{" "}
            {member.NgayDangKy ? new Date(member.NgayDangKy).toLocaleString("vi-VN") : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Ngày Sinh:</span>{" "}
            {member.user?.NgaySinh
              ? new Date(member.user.NgaySinh).toLocaleDateString("vi-VN")
              : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Giới Tính:</span>{" "}
            {member.user?.GioiTinh === 1 ? "Nam" : member.user?.GioiTinh === 0 ? "Nữ" : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Địa Chỉ:</span> {member.user?.DiaChi || "N/A"}
          </p>
        </div>

        {/* Trainer Info */}
        <div>
          <p className="mb-2">
            <span className="font-medium">Huấn Luyện Viên:</span>{" "}
            {member.huanluyenvien?.user?.Ten || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Chứng Chỉ:</span>{" "}
            {member.huanluyenvien?.ChungChi || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Bằng Cấp:</span>{" "}
            {member.huanluyenvien?.BangCap || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Chuyên Môn:</span>{" "}
            {member.huanluyenvien?.ChuyeMon || "N/A"}
          </p>
        </div>
      </div>

      {/* Package Info */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Thông Tin Gói Tập</h3>
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="mb-2">
            <span className="font-medium">Tên Gói:</span> {member.goitap?.Ten || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Loại Gói:</span> {member.goitap?.Loai || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Giá Gói:</span>{" "}
            {member.goitap?.Gia
              ? `${parseFloat(member.goitap.Gia.toString()).toLocaleString("vi-VN")} VND`
              : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Thời Gian (Tháng):</span>{" "}
            {chitietgoitap?.SoThang || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Tổng Tiền:</span>{" "}
            {chitietgoitap?.TongTien
              ? `${parseFloat(chitietgoitap.TongTien.toString()).toLocaleString("vi-VN")} VND`
              : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Ngày Bắt Đầu:</span>{" "}
            {chitietgoitap?.NgayDangKy
              ? new Date(chitietgoitap.NgayDangKy).toLocaleString("vi-VN")
              : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Ngày Hết Hạn:</span>{" "}
            {chitietgoitap?.NgayHetHan
              ? new Date(chitietgoitap.NgayHetHan).toLocaleString("vi-VN")
              : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Trạng Thái:</span>{" "}
            {chitietgoitap?.TinhTrang === 1
              ? "Hoạt động"
              : chitietgoitap?.TinhTrang === 0
                ? "Hết hạn"
                : "N/A"}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link href="/listManagement/membership" className="text-blue-500 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default MembershipDetail;