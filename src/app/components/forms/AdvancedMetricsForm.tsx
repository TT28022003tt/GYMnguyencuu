"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMyContext } from "@/contexts/useContext";
import { z } from "zod";

interface AdvancedMetricsFormProps {
  type: "create" | "update";
  data?: {
    idAdvancedMetrics?: number;
    idMaHV?: number;
    BodyFatPercent?: number;
    MuscleMass?: number;
    VisceralFat?: number;
    BasalMetabolicRate?: number;
    BoneMass?: number;
    WaterPercent?: number;
    Mota?: string;
    Ten?: string;
  };
}

interface HocVien {
  idMaHV: number;
  Ten: string;
}

// Zod schema for validation
const advancedMetricsSchema = z.object({
  idMaHV: z.number().min(1, "Vui lòng chọn học viên"),
  BodyFatPercent: z.number().min(0).nullable().optional(),
  MuscleMass: z.number().min(0).nullable().optional(),
  VisceralFat: z.number().min(0).nullable().optional(),
  BasalMetabolicRate: z.number().min(0).nullable().optional(),
  BoneMass: z.number().min(0).nullable().optional(),
  WaterPercent: z.number().min(0).nullable().optional(),
  Mota: z.string().nullable().optional(),
}).refine(
  (data) => {
    return [
      data.BodyFatPercent,
      data.MuscleMass,
      data.VisceralFat,
      data.BasalMetabolicRate,
      data.BoneMass,
      data.WaterPercent,
    ].some((value) => value !== null && value !== undefined && value >= 0);
  },
  { message: "Vui lòng cung cấp ít nhất một chỉ số nâng cao", path: ["general"] }
);

export default function AdvancedMetricsForm({ type, data }: AdvancedMetricsFormProps) {
  const { user } = useMyContext();
  const [formData, setFormData] = useState({
    idMaHV: data?.idMaHV || 0,
    Ten: data?.Ten || "",
    BodyFatPercent: data?.BodyFatPercent || "",
    MuscleMass: data?.MuscleMass || "",
    VisceralFat: data?.VisceralFat || "",
    BasalMetabolicRate: data?.BasalMetabolicRate || "",
    BoneMass: data?.BoneMass || "",
    WaterPercent: data?.WaterPercent || "",
    Mota: data?.Mota || "",
  });
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
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        idMaHV: formData.idMaHV,
        BodyFatPercent: formData.BodyFatPercent ? Number(formData.BodyFatPercent) : null,
        MuscleMass: formData.MuscleMass ? Number(formData.MuscleMass) : null,
        VisceralFat: formData.VisceralFat ? Number(formData.VisceralFat) : null,
        BasalMetabolicRate: formData.BasalMetabolicRate ? Number(formData.BasalMetabolicRate) : null,
        BoneMass: formData.BoneMass ? Number(formData.BoneMass) : null,
        WaterPercent: formData.WaterPercent ? Number(formData.WaterPercent) : null,
        Mota: formData.Mota || null,
      };

      advancedMetricsSchema.parse(payload);

      const url =
        type === "create"
          ? "/api/advancedmetrics"
          : `/api/advancedmetrics/${data?.idAdvancedMetrics}`;

      const res = await fetch(url, {
        method: type === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });


      if (res.ok) {
        alert(`${type === "create" ? "Tạo" : "Cập nhật"} chỉ số nâng cao thành công!`);
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
        {type === "create" ? "Tạo Chỉ Số Nâng Cao" : "Cập Nhật Chỉ Số Nâng Cao"}
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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
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
          <label className="block font-medium text-gray-700 mb-2">Tỷ lệ mỡ cơ thể (%)</label>
          <input
            type="number"
            name="BodyFatPercent"
            value={formData.BodyFatPercent}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            min="0"
            step="0.1"
          />
          {errors.BodyFatPercent && <p className="text-red-500 text-sm mt-1">{errors.BodyFatPercent}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Khối lượng cơ (kg)</label>
          <input
            type="number"
            name="MuscleMass"
            value={formData.MuscleMass}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            min="0"
            step="0.1"
          />
          {errors.MuscleMass && <p className="text-red-500 text-sm mt-1">{errors.MuscleMass}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Mỡ nội tạng</label>
          <input
            type="number"
            name="VisceralFat"
            value={formData.VisceralFat}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            min="0"
            step="0.1"
          />
          {errors.VisceralFat && <p className="text-red-500 text-sm mt-1">{errors.VisceralFat}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Tỷ lệ trao đổi chất (kcal)</label>
          <input
            type="number"
            name="BasalMetabolicRate"
            value={formData.BasalMetabolicRate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            min="0"
            step="1"
          />
          {errors.BasalMetabolicRate && <p className="text-red-500 text-sm mt-1">{errors.BasalMetabolicRate}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Khối lượng xương (kg)</label>
          <input
            type="number"
            name="BoneMass"
            value={formData.BoneMass}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            min="0"
            step="0.1"
          />
          {errors.BoneMass && <p className="text-red-500 text-sm mt-1">{errors.BoneMass}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">Tỷ lệ nước (%)</label>
          <input
            type="number"
            name="WaterPercent"
            value={formData.WaterPercent}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            min="0"
            step="0.1"
          />
          {errors.WaterPercent && <p className="text-red-500 text-sm mt-1">{errors.WaterPercent}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block font-medium text-gray-700 mb-2">Mô tả</label>
          <textarea
            name="Mota"
            value={formData.Mota}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-purple focus:border-transparent resize-vertical"
            rows={4}
          />
          {errors.Mota && <p className="text-red-500 text-sm mt-1">{errors.Mota}</p>}
        </div>
      </div>
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
        className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300 self-center ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary-purple hover:bg-purple-700"
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
}