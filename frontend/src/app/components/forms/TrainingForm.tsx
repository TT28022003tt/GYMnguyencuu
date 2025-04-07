"use client";
import { useState } from "react";

// Định nghĩa kiểu dữ liệu cho props
interface TrainingPlan {
  name: string;
  goal: string;
  duration: string;
  details: { week: string; description: string }[];
}

interface TrainingFormProps {
  type: "create" | "update";
  data?: TrainingPlan;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ type, data }) => {
  const [formData, setFormData] = useState<TrainingPlan>(
    data || { name: "", goal: "", duration: "", details: [] }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${type === "create" ? "Thêm" : "Cập nhật"} liệu trình:`, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{type === "create" ? "Thêm" : "Chỉnh sửa"} Liệu Trình</h2>
      <input
        type="text"
        placeholder="Tên liệu trình"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Mục tiêu"
        value={formData.goal}
        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Thời gian (Tuần)"
        value={formData.duration}
        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">
        {type === "create" ? "Thêm mới" : "Cập nhật"}
      </button>
    </form>
  );
};

export default TrainingForm;
