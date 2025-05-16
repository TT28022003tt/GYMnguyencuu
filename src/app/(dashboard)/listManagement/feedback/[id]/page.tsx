import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import prisma from "../../../../../../prisma/client";

interface FeedbackDetailProps {
  params: { id: string };
}

const FeedbackDetail = async ({ params }: FeedbackDetailProps) => {
  const id = parseInt(params.id);

  // Fetch feedback by id
  const feedback = await prisma.phanhoi.findUnique({
    where: { idMaPH: id },
    include: {
      user: {
        select: {
          Ten: true,
          Email: true,
          SoDienThoai: true,
          Anh: true,
        },
      },
    },
  });

  if (!feedback) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Feedback không tồn tại</h1>
        <Link href="/listManagement/feedback" className="text-blue-500 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Chi Tiết Feedback</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div>
          <div className="flex items-center mb-4">
            <Image
              src={feedback.user.Anh || "/default-avatar.png"}
              alt={feedback.user.Ten || "Ẩn danh"}
              width={60}
              height={60}
              className="w-15 h-15 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="text-lg font-semibold">{feedback.user.Ten || "Ẩn danh"}</h2>
              <p className="text-sm text-gray-500">{feedback.user.Email || "N/A"}</p>
              <p className="text-sm text-gray-500">{feedback.user.SoDienThoai || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Feedback Info */}
        <div>
          <p className="mb-2">
            <span className="font-medium">Ngày Gửi:</span>{" "}
            {feedback.NgayTao ? new Date(feedback.NgayTao).toLocaleString("vi-VN") : "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Loại Feedback:</span> {feedback.LoaiPhanHoi || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Đánh Giá:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${feedback.SoSao && star <= feedback.SoSao ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </p>
        </div>
      </div>

      {/* Feedback Content */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Nội Dung Feedback</h3>
        <p className="text-gray-700 p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
          {feedback.NoiDung || "Không có nội dung"}
        </p>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link href="/listManagement/feedback" className="text-blue-500 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default FeedbackDetail;