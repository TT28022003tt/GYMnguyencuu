"use client";

import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FeedbackDetailModalProps {
  feedback: {
    idMaPH: number;
    customerName: string;
    email: string | null;
    phone: string | null;
    sentDate: string;
    rating: number | null;
    feedbackType: string | null;
    content: string | null;
    photo: string | null;
  };
  onClose: () => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({ feedback, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-directional-400 hover:text-orange-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-orange-400">Chi Tiết Feedback</h2>

        <div className="mb-4">
          <div className="flex items-center mb-4">
            <Image
              src={feedback.photo || "/images/default-avatar.png"}
              alt={feedback.customerName}
              width={60}
              height={60}
              className="w-15 h-15 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold">{feedback.customerName}</h3>
              <p className="text-sm text-gray-400">{feedback.email || "N/A"}</p>
              <p className="text-sm text-gray-400">{feedback.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm">
            <span className="font-medium text-orange-400">Ngày Gửi:</span>{" "}
            {feedback.sentDate ? new Date(feedback.sentDate).toLocaleString("vi-VN") : "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Loại Feedback:</span>{" "}
            {feedback.feedbackType || "N/A"}
          </p>
          <div className="text-sm flex items-center">
            <span className="font-medium text-orange-400 mr-2">Đánh Giá:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    feedback.rating && star <= feedback.rating ? "text-orange-400" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-orange-400 mb-2">Nội Dung Feedback</h3>
          <p className="text-gray-300 p-4 bg-gray-800 rounded-md whitespace-pre-wrap max-h-60 overflow-y-auto">
            {feedback.content || "Không có nội dung"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default FeedbackDetailModal;