"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const nutritionSchema = z.object({
  TenThucDon: z.string().min(1, "Tên thực đơn không được để trống"),
  SoCalo: z.coerce.number().min(0, "Số calo phải là số không âm"),
  NgayBatDau: z.string().min(1, "Ngày bắt đầu không được để trống"),
  MaHV: z.coerce.number().min(1, "Mã học viên phải lớn hơn 0"),
  chiTietThucDon: z
    .array(
      z.object({
        idchitietthucdon: z.number().optional(),
        buaAn: z
          .array(
            z.object({
              idBuaAn: z.number().optional(),
              TenBua: z.string().min(1, "Tên bữa ăn không được để trống"),
              MoTa: z.string().min(1, "Mô tả không được để trống"),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

type NutritionFormInput = z.infer<typeof nutritionSchema>;

interface NutritionADFormProps {
  type?: "create" | "update";
  data?: NutritionFormInput & { idThucDon?: number };
  onSuccess?: () => void;
}

export default function NutritionADForm({ type = "create", data, onSuccess }: NutritionADFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<NutritionFormInput>({
    resolver: zodResolver(nutritionSchema),
    mode: "onChange",
    defaultValues: {
      TenThucDon: "",
      SoCalo: 0,
      NgayBatDau: new Date().toISOString().split("T")[0],
      MaHV: 1,
      chiTietThucDon: [],
    },
  });

  const [newDay, setNewDay] = useState({ buaAn: [] as { TenBua: string; MoTa: string }[] });
  const [newMeal, setNewMeal] = useState({ TenBua: "", MoTa: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<{ idMaHV: number; Ten: string }[]>([]);

  // Lấy danh sách học viên
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/hocvien");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học viên:", error);
      }
    };
    fetchStudents();
  }, []);

  // Lấy chi tiết thực đơn khi chỉnh sửa
  useEffect(() => {
    if (type === "update" && data?.idThucDon) {
      const fetchNutritionDetail = async () => {
        try {
          const response = await fetch(`/api/healthconsultation/${data.idThucDon}`);
          if (response.ok) {
            const nutrition = await response.json();
            reset({
              TenThucDon: nutrition.TenThucDon || "",
              SoCalo: nutrition.SoCalo || 0,
              NgayBatDau: nutrition.NgayBatDau
                ? new Date(nutrition.NgayBatDau).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              MaHV: nutrition.hocvien?.idMaHV || 1,
              chiTietThucDon: nutrition.chitietthucdon?.map((day: any) => ({
                idchitietthucdon: day.idchitietthucdon,
                buaAn: Array.isArray(day.buaan)
                  ? day.buaan.map((meal: any) => ({
                      idBuaAn: meal.idBuaAn,
                      TenBua: meal.TenBua || "",
                      MoTa: meal.MoTa || "",
                    }))
                  : [],
              })) || [],
            });
          }
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết thực đơn:", error);
        }
      };
      fetchNutritionDetail();
    }
  }, [data, type, reset]);

  const onSubmit = async (formData: NutritionFormInput) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        idThucDon: data?.idThucDon,
      };
      const response = await fetch(
        type === "create" ? "/api/healthconsultation" : `/api/healthconsultation/${data?.idThucDon}`,
        {
          method: type === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi gửi dữ liệu");
      }

      alert(`${type === "create" ? "Tạo" : "Cập nhật"} thành công!`);
      if (onSuccess) onSuccess();
      reset();
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMeal = () => {
    if (!newMeal.TenBua || !newMeal.MoTa) {
      alert("Vui lòng điền đầy đủ tên bữa ăn và mô tả");
      return;
    }
    setNewDay({
      buaAn: [...newDay.buaAn, { TenBua: newMeal.TenBua, MoTa: newMeal.MoTa }],
    });
    setNewMeal({ TenBua: "", MoTa: "" });
  };

  const removeMeal = (index: number) => {
    setNewDay({
      buaAn: newDay.buaAn.filter((_, i) => i !== index),
    });
  };

  const addDay = () => {
    if (newDay.buaAn.length === 0) {
      alert("Vui lòng thêm ít nhất một bữa ăn trước khi thêm ngày");
      return;
    }
    const currentDays = watch("chiTietThucDon") || [];
    setValue("chiTietThucDon", [...currentDays, { buaAn: newDay.buaAn }]);
    setNewDay({ buaAn: [] });
  };

  const removeDay = (index: number) => {
    const currentDays = watch("chiTietThucDon") || [];
    setValue("chiTietThucDon", currentDays.filter((_, i) => i !== index));
  };

  const chiTietThucDon = watch("chiTietThucDon") || [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-lg max-w-xl mx-auto "
    >
      <div>
        <label className="block mb-1 font-medium text-orange-400">Tên thực đơn</label>
        <input
          {...register("TenThucDon")}
          className="w-full border rounded p-2 bg-gray-700 text-white"
          placeholder="Nhập tên thực đơn"
          required
        />
        {errors.TenThucDon && <p className="text-red-500 text-sm">{errors.TenThucDon.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium text-orange-400">Số calo</label>
        <input
          type="number"
          {...register("SoCalo")}
          className="w-full border rounded p-2 bg-gray-700 text-white"
          placeholder="Nhập số calo"
          min="0"
        />
        {errors.SoCalo && <p className="text-red-500 text-sm">{errors.SoCalo.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium text-orange-400">Ngày bắt đầu</label>
        <input
          type="date"
          {...register("NgayBatDau")}
          className="w-full border rounded p-2 bg-gray-700 text-white"
          required
        />
        {errors.NgayBatDau && <p className="text-red-500 text-sm">{errors.NgayBatDau.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium text-orange-400">Học viên</label>
        <select
          {...register("MaHV")}
          className="w-full border rounded p-2 bg-gray-700 text-white"
          required
        >
          <option value="">Chọn học viên</option>
          {students.map((student) => (
            <option key={student.idMaHV} value={student.idMaHV}>
              {student.Ten}
            </option>
          ))}
        </select>
        {errors.MaHV && <p className="text-red-500 text-sm">{errors.MaHV.message}</p>}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-orange-400">Chi tiết thực đơn</h3>
        <div className="mb-4">
          <h4 className="font-medium mb-1 text-white">Thêm bữa ăn cho ngày mới</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Tên bữa ăn"
              value={newMeal.TenBua}
              onChange={(e) => setNewMeal({ ...newMeal, TenBua: e.target.value })}
              className="border rounded p-2 w-1/3 bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newMeal.MoTa}
              onChange={(e) => setNewMeal({ ...newMeal, MoTa: e.target.value })}
              className="border rounded p-2 w-1/3 bg-gray-700 text-white"
            />
            <button
              type="button"
              onClick={addMeal}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-300 mb-2">
            {newDay.buaAn.length > 0 ? (
              newDay.buaAn.map((meal, idx) => (
                <li key={idx} className="flex justify-between items-center mb-1">
                  <span>{`${meal.TenBua}: ${meal.MoTa}`}</span>
                  <button
                    type="button"
                    onClick={() => removeMeal(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </li>
              ))
            ) : (
              <li>Chưa có bữa ăn nào được thêm</li>
            )}
          </ul>
          <button
            type="button"
            onClick={addDay}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            disabled={newDay.buaAn.length === 0}
          >
            Thêm ngày
          </button>
        </div>

        <ul className="list-disc pl-5 text-sm text-gray-300">
          {chiTietThucDon.length > 0 ? (
            chiTietThucDon.map((day, dayIdx) => (
              <li key={dayIdx} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Ngày {dayIdx + 1} (
                    {new Date(
                      new Date(watch("NgayBatDau") || new Date()).getTime() +
                        dayIdx * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                    )
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDay(dayIdx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa ngày
                  </button>
                </div>
                <ul className="list-circle pl-5">
                  {Array.isArray(day.buaAn) && day.buaAn.length > 0 ? (
                    day.buaAn.map((meal, mealIdx) => (
                      <li key={mealIdx} className="flex justify-between items-center">
                        <span>{`${meal.TenBua}: ${meal.MoTa}`}</span>
                      </li>
                    ))
                  ) : (
                    <li>Chưa có bữa ăn</li>
                  )}
                </ul>
              </li>
            ))
          ) : (
            <li>Chưa có ngày nào được thêm</li>
          )}
        </ul>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {type === "create" ? "Tạo" : "Cập nhật"}
      </button>
    </form>
  );
}