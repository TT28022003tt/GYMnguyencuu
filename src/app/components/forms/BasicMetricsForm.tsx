"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMyContext } from "@/contexts/useContext";
import { z } from "zod";

interface BasicMetricsFormProps {
  type: "create" | "update";
  data?: {
    idBasicMetrics?: number;
    idMaHV?: number;
    Height?: number;
    Weight?: number;
    Chest?: number;
    Waist?: number;
    hips?: number;
    Arm?: number;
    Thigh?: number;
    Calf?: number;
    Mota?: string;
    Ten?: string;
  };
}

interface HocVien {
  idMaHV: number;
  Ten: string;
}

// Zod schema for validation
const basicMetricsSchema = z.object({
  idMaHV: z.number().min(1, "Vui lòng chọn học viên"),
  Height: z.number().min(1, "Chiều cao phải lớn hơn 0").nullable(),
  Weight: z.number().min(1, "Cân nặng phải lớn hơn 0").nullable(),
  Chest: z.number().min(0).nullable().optional(),
  Waist: z.number().min(0).nullable().optional(),
  hips: z.number().min(0).nullable().optional(),
  Arm: z.number().min(0).nullable().optional(),
  Thigh: z.number().min(0).nullable().optional(),
  Calf: z.number().min(0).nullable().optional(),
  Mota: z.string().nullable().optional(),
});

const BasicMetricsForm = ({ type, data }: BasicMetricsFormProps) => {
  const { user } = useMyContext();
  const [formData, setFormData] = useState({
    idMaHV: data?.idMaHV || 0,
    Ten: data?.Ten || "",
    Height: data?.Height || "",
    Weight: data?.Weight || "",
    Chest: data?.Chest || "",
    Waist: data?.Waist || "",
    hips: data?.hips || "",
    Arm: data?.Arm || "",
    Thigh: data?.Thigh || "",
    Calf: data?.Calf || "",
    Mota: data?.Mota || "",
  });
  const [bmi, setBMI] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hocViens, setHocViens] = useState<HocVien[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHocVien = async () => {
      try {
        const res = await fetch("/api/hocvien", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Lỗi lấy danh sách học viên");
        const data: HocVien[] = await res.json();
        setHocViens(data);
      } catch (err: any) {
        setErrors((prev) => ({ ...prev, general: err.message }));
      }
    };
    fetchHocVien();
  }, []);

  useEffect(() => {
    if (formData.Height && formData.Weight) {
      const heightInMeters = Number(formData.Height) / 100;
      const bmiValue = Number(formData.Weight) / (heightInMeters * heightInMeters);
      setBMI(bmiValue);
    } else {
      setBMI(null);
    }
  }, [formData.Height, formData.Weight]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "Ten") {
      const selectedHocVien = hocViens.find((hv) => hv.Ten === value);
      setFormData((prev) => ({
        ...prev,
        Ten: value,
        idMaHV: selectedHocVien ? selectedHocVien.idMaHV : prev.idMaHV,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "Mota" ? value : value ? Number(value) : "",
      }));
    }
    // Clear error for the field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for validation
      const payload = {
        idMaHV: formData.idMaHV,
        Height: formData.Height ? Number(formData.Height) : null,
        Weight: formData.Weight ? Number(formData.Weight) : null,
        Chest: formData.Chest ? Number(formData.Chest) : null,
        Waist: formData.Waist ? Number(formData.Waist) : null,
        hips: formData.hips ? Number(formData.hips) : null,
        Arm: formData.Arm ? Number(formData.Arm) : null,
        Thigh: formData.Thigh ? Number(formData.Thigh) : null,
        Calf: formData.Calf ? Number(formData.Calf) : null,
        Mota: formData.Mota || null,
      };

      // Validate with Zod
      basicMetricsSchema.parse(payload);

      const url =
        type === "create"
          ? "/api/basicmetrics"
          : `/api/basicmetrics/${data?.idBasicMetrics}`;

      const res = await fetch(url, {
        method: type === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });


      if (res.ok) {
        alert(`${type === "create" ? "Tạo" : "Cập nhật"} chỉ số cơ bản thành công!`);
        window.dispatchEvent(new Event("formSuccess"));
      } else {
        const error = await res.json();
        setErrors({ general: `Lỗi: ${error.message || "Không thể lưu chỉ số"}` });
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "Lỗi: " + err.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 flex flex-col gap-6 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {type === "create" ? "Tạo Chỉ Số Cơ Bản" : "Cập Nhật Chỉ Số Cơ Bản"}
      </h2>
      {errors.general && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 bg-red-100 p-3 rounded-md text-center"
        >
          {errors.general}
        </motion.p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-2">Học viên</label>
          <select
            name="Ten"
            value={formData.Ten}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            required
            disabled={type === "update"}
          >
            <option value="">Chọn học viên</option>
            {hocViens.map((hv) => (
              <option key={hv.idMaHV} value={hv.Ten}>
                {hv.Ten}
              </option>
            ))}
          </select>
          {errors.idMaHV && <p className="text-red-500 text-sm mt-1">{errors.idMaHV}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Chiều cao (cm)</label>
          <input
            type="number"
            name="Height"
            value={formData.Height}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            required
            min="0"
          />
          {errors.Height && <p className="text-red-500 text-sm mt-1">{errors.Height}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Cân nặng (kg)</label>
          <input
            type="number"
            name="Weight"
            value={formData.Weight}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            required
            min="0"
          />
          {errors.Weight && <p className="text-red-500 text-sm mt-1">{errors.Weight}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">BMI</label>
          <input
            type="text"
            value={bmi ? bmi.toFixed(2) : "N/A"}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Vòng ngực (cm)</label>
          <input
            type="number"
            name="Chest"
            value={formData.Chest}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            min="0"
          />
          {errors.Chest && <p className="text-red-500 text-sm mt-1">{errors.Chest}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Vòng eo (cm)</label>
          <input
            type="number"
            name="Waist"
            value={formData.Waist}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            min="0"
          />
          {errors.Waist && <p className="text-red-500 text-sm mt-1">{errors.Waist}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Vòng mông (cm)</label>
          <input
            type="number"
            name="hips"
            value={formData.hips}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            min="0"
          />
          {errors.hips && <p className="text-red-500 text-sm mt-1">{errors.hips}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Vòng bắp tay (cm)</label>
          <input
            type="number"
            name="Arm"
            value={formData.Arm}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            min="0"
          />
          {errors.Arm && <p className="text-red-500 text-sm mt-1">{errors.Arm}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Vòng đùi (cm)</label>
          <input
            type="number"
            name="Thigh"
            value={formData.Thigh}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            min="0"
          />
          {errors.Thigh && <p className="text-red-500 text-sm mt-1">{errors.Thigh}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Vòng bắp chân (cm)</label>
          <input
            type="number"
            name="Calf"
            value={formData.Calf}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            min="0"
          />
          {errors.Calf && <p className="text-red-500 text-sm mt-1">{errors.Calf}</p>}
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea
          name="Mota"
          value={formData.Mota}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-vertical"
          rows={4}
        />
        {errors.Mota && <p className="text-red-500 text-sm mt-1">{errors.Mota}</p>}
      </div>
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
        className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300 self-center ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary-blue hover:bg-blue-700"
          }`}
      >
        {isSubmitting && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-5 w-5 border-t-2 border-white rounded-full"
          />
        )}
        {type === "create" ? "Tạo" : "Cập nhật"}
      </motion.button>
    </motion.form>
  );
};

export default BasicMetricsForm;