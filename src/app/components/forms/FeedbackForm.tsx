"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FeedbackFormProps {
  userId: number;
  onClose: () => void; // Hàm để đóng modal
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ userId, onClose }) => {
  const [noiDung, setNoiDung] = useState("");
  const [soSao, setSoSao] = useState(5);
  const [loaiPhanHoi, setLoaiPhanHoi] = useState("Service");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noiDung,
          soSao,
          loaiPhanHoi,
          idUser: userId,
        }),
      });
      if (res.ok) {
        alert("Feedback đã được gửi!");
        setNoiDung("");
        setSoSao(5);
        setLoaiPhanHoi("Service");
        onClose(); // Đóng modal
      } else {
        alert("Gửi feedback thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-orange-400 hover:text-orange-500">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-orange-400">Gửi Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Loại Feedback</label>
            <select
              value={loaiPhanHoi}
              onChange={(e) => setLoaiPhanHoi(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Service">Dịch vụ</option>
              <option value="ChatBoxAI">ChatBox AI</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Đánh giá</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${soSao >= star ? "text-orange-400" : "text-gray-600"}`}
                  onClick={() => setSoSao(star)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Nhập nội dung feedback..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition"
          >
            Gửi Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;