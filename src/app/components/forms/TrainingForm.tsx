"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const trainingSchema = z.object({
  TenCTT: z.string().min(1, "Tên chương trình tập không được để trống"),
  MucTieu: z.string().min(1, "Mục tiêu không được để trống"),
  ThoiGian: z.string().min(1, "Thời gian không được để trống"),
  MaHV: z.coerce.number().min(1, "Mã học viên không hợp lệ"),
  chiTietMucTieu: z
    .array(
      z.object({
        idChiTietMucTieu: z.number().optional(),
        ThoiGian: z.string().min(1, "Thời gian không được để trống"),
        MoTa: z.string().min(1, "Mô tả không được để trống"),
      })
    )
    .optional(),
});

type TrainingFormInput = z.infer<typeof trainingSchema>;

export default function TrainingForm({
  type = "create",
  data,
}: {
  type?: "create" | "update";
  data?: TrainingFormInput & { idChuongTrinhTap?: number };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TrainingFormInput>({
    resolver: zodResolver(trainingSchema),
    defaultValues: data || {
      TenCTT: "",
      MucTieu: "",
      ThoiGian: "",
      MaHV: 1,
      chiTietMucTieu: [],
    },
  });

  const [chiTiet, setChiTiet] = useState({
    ThoiGian: "",
    MoTa: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      console.log("data:", data); // Debug
      reset(data);
      console.log("After reset:", watch("chiTietMucTieu"));
    }
  }, [data, reset]);

  const onSubmit = async (formData: TrainingFormInput) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting data:", formData); // Debug
      const response = await fetch(
        type === "create"
          ? "/api/TraniningPlans"
          : `/api/TraniningPlans/${data?.idChuongTrinhTap}`,
        {
          method: type === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Lỗi khi gửi dữ liệu");

      alert(`${type === "create" ? "Create" : "Update"} thành công!`);
      // Gọi lại callback nếu có
      if (typeof window !== "undefined") {
        const event = new CustomEvent("formSuccess");
        window.dispatchEvent(event);
      }
    } catch (err: any) {
      console.error("Submit error:", err); // Debug
      alert(err.message);
    }
  };

  const addChiTiet = () => {
    if (!chiTiet.ThoiGian || !chiTiet.MoTa) return;

    const current = watch("chiTietMucTieu") || [];
    setValue("chiTietMucTieu", [...current, { ThoiGian: chiTiet.ThoiGian, MoTa: chiTiet.MoTa }]);
    setChiTiet({ ThoiGian: "", MoTa: "" });
  };
  const removeChiTiet = (index: number) => {
    const current = watch("chiTietMucTieu") || [];
    setValue(
      "chiTietMucTieu",
      current.filter((_, i) => i !== index)
    );
  };
  const chiTietMucTieu = watch("chiTietMucTieu") || [];
  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-lg max-w-xl mx-auto">
      <div>
        <label className="block mb-1 font-medium">Tên chương trình tập</label>
        <input {...register("TenCTT")} className="w-full border rounded p-2" />
        {errors.TenCTT && <p className="text-red-500 text-sm">{errors.TenCTT.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Mục tiêu</label>
        <textarea {...register("MucTieu")} className="w-full border rounded p-2" />
        {errors.MucTieu && <p className="text-red-500 text-sm">{errors.MucTieu.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Thời gian chương trình</label>
        <input {...register("ThoiGian")} className="w-full border rounded p-2" />
        {errors.ThoiGian && <p className="text-red-500 text-sm">{errors.ThoiGian.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Mã học viên</label>
        <input type="number" {...register("MaHV")} className="w-full border rounded p-2" />
        {errors.MaHV && <p className="text-red-500 text-sm">{errors.MaHV.message}</p>}
      </div>

      {/* Chi tiết mục tiêu */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Chi tiết mục tiêu</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Thời gian"
            value={chiTiet.ThoiGian}
            onChange={(e) => setChiTiet({ ...chiTiet, ThoiGian: e.target.value })}
            className="border rounded p-2 w-1/2"
          />
          <input
            type="text"
            placeholder="Mô tả"
            value={chiTiet.MoTa}
            onChange={(e) => setChiTiet({ ...chiTiet, MoTa: e.target.value })}
            className="border rounded p-2 w-1/2"
          />
          <button type="button" onClick={addChiTiet} className="bg-blue-500 text-white px-3 rounded">
            +
          </button>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {chiTietMucTieu.length > 0 ? (
            chiTietMucTieu.map((ct, idx) => (
              <li key={idx} className="flex justify-between items-center mb-1">
                <span>
                  {ct.ThoiGian}: {ct.MoTa}
                </span>
                <button
                  type="button"
                  onClick={() => removeChiTiet(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </li>
            ))
          ) : (
            <li>Chưa có chi tiết mục tiêu</li>
          )}
        </ul>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}
