"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const scheduleSchema = z.object({
  Thu: z.number().min(1).max(7, { message: "Thứ phải từ 1 đến 7" }),
  GioBatDau: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Giờ bắt đầu phải định dạng HH:mm" }),
});

const schema = z.object({
  Ten: z.string().min(1, { message: "Tên lớp là bắt buộc" }),
  Phong: z.string().optional(),
  MoTa: z.string().optional(),
  TheLoai: z.string().optional(),
  SoLuongMax: z.number().min(1, { message: "Số lượng tối đa phải lớn hơn 0" }),
  Phi: z.number().optional(),
  TrangThai: z.enum(["Đang mở", "Đã đóng", "Hủy"], { message: "Trạng thái không hợp lệ" }),
  ThoiLuong: z.number().optional(),
  ThoiGianBatDau: z.string().min(1, { message: "Thời gian bắt đầu là bắt buộc" }),
  ThoiGianKetThuc: z.string().min(1, { message: "Thời gian kết thúc là bắt buộc" }),
  idMaHLV: z.number().min(1, { message: "Huấn luyện viên là bắt buộc" }),
  lichlophoc: z.array(scheduleSchema).min(1, { message: "Phải có ít nhất một lịch học" }),
});

type Inputs = z.infer<typeof schema>;

interface ClassFormProps {
  type: "create" | "update";
  data?: Inputs & { id?: number };
}

const ClassForm = ({ type, data }: ClassFormProps) => {
  const [trainers, setTrainers] = useState<{ idMaHLV: number; Ten: string }[]>([]);
  const [phiDisplay, setPhiDisplay] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      Ten: "",
      Phong: "",
      MoTa: "",
      TheLoai: "",
      SoLuongMax: 1,
      Phi: 0,
      TrangThai: "Đang mở",
      ThoiLuong: 0,
      ThoiGianBatDau: "",
      ThoiGianKetThuc: "",
      idMaHLV: undefined, // Không đặt mặc định là 1
      lichlophoc: [{ Thu: 1, GioBatDau: "08:00" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lichlophoc",
  });

  // Fetch trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch("/api/huanluyenvien");
        if (res.ok) {
          const data = await res.json();
          console.log("Trainers data:", data);
          setTrainers(data);
        } else {
          console.error("Lỗi khi lấy danh sách huấn luyện viên");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách huấn luyện viên:", error);
      }
    };
    fetchTrainers();
  }, []);

  // Reset form when data changes (for update mode)
  useEffect(() => {
    if (type === "update" && data) {
      console.log("Form data:", data); // Log để kiểm tra data
      reset({
        Ten: data.Ten || "",
        Phong: data.Phong || "",
        MoTa: data.MoTa || "",
        TheLoai: data.TheLoai || "",
        SoLuongMax: data.SoLuongMax || 1,
        Phi: data.Phi || 0,
        TrangThai: data.TrangThai || "Đang mở",
        ThoiLuong: data.ThoiLuong || 0,
        ThoiGianBatDau: data.ThoiGianBatDau || "",
        ThoiGianKetThuc: data.ThoiGianKetThuc || "",
        idMaHLV: data.idMaHLV ?? undefined, // Đặt HLV từ data
        lichlophoc:
          data.lichlophoc && data.lichlophoc.length > 0
            ? data.lichlophoc
            : [{ Thu: 1, GioBatDau: "08:00" }],
      });
      if (data.Phi) {
        setPhiDisplay(data.Phi.toLocaleString("vi-VN"));
      }
    }
  }, [data, type, reset]);

  const handlePhiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = parseInt(value) || 0;
    setPhiDisplay(numberValue.toLocaleString("vi-VN"));
    setValue("Phi", numberValue);
  };

  const onSubmit = async (formData: Inputs) => {
    console.log("Form data submitted:", formData); // Log để kiểm tra idMaHL hơi trước khi submit
    setIsSubmitting(true);
    try {
      const url = type === "create" ? "/api/admin/class" : `/api/admin/class/${data?.id}`;
      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Lỗi khi gửi dữ liệu lớp học");

      alert(`${type === "create" ? "Tạo" : "Cập nhật"} lớp học thành công!`);

      window.dispatchEvent(new CustomEvent("refreshClassList"));
      window.dispatchEvent(new CustomEvent("formSuccess"));
    } catch (err: any) {
      console.error("Lỗi submit:", err);
      alert(err.message || "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 bg-white text-black rounded-lg max-w-5xl mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold text-orange-400">
        {type === "create" ? "Tạo Lớp Học Mới" : "Cập Nhật Lớp Học"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Tên Lớp"
          name="Ten"
          register={register}
          error={errors.Ten}
          type="text"
        />
        <InputField
          label="Phòng"
          name="Phong"
          register={register}
          error={errors.Phong}
          type="text"
        />
        <InputField
          label="Thể Loại"
          name="TheLoai"
          register={register}
          error={errors.TheLoai}
          type="text"
        />
        <InputField
          label="Số Lượng Tối Đa"
          name="SoLuongMax"
          register={register}
          error={errors.SoLuongMax}
          type="number"
        />
        <div className="flex flex-col gap-2 bg-white text-black">
          <label className="text-xs">Phí (VND)</label>
          <input
            value={phiDisplay}
            onChange={handlePhiChange}
            placeholder="Nhập phí"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
          />
          {errors.Phi?.message && (
            <p className="text-xs text-red-400">{errors.Phi.message}</p>
          )}
        </div>
        <InputField
          label="Thời Lượng (phút)"
          name="ThoiLuong"
          register={register}
          error={errors.ThoiLuong}
          type="number"
        />
        <InputField
          label="Thời Gian Bắt Đầu"
          name="ThoiGianBatDau"
          register={register}
          error={errors.ThoiGianBatDau}
          type="date"
        />
        <InputField
          label="Thời Gian Kết Thúc"
          name="ThoiGianKetThuc"
          register={register}
          error={errors.ThoiGianKetThuc}
          type="date"
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs">Huấn Luyện Viên</label>
          <Controller
            name="idMaHLV"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
              >
                <option value="">Chọn HLV</option>
                {trainers.length > 0 ? (
                  trainers.map((trainer) => (
                    <option key={trainer.idMaHLV} value={trainer.idMaHLV}>
                      {trainer.Ten}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Đang tải...
                  </option>
                )}
              </select>
            )}
          />
          {errors.idMaHLV?.message && (
            <p className="text-xs text-red-400">{errors.idMaHLV.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 bg-white text-black">
        <label className="text-xs">Mô Tả</label>
        <textarea
          {...register("MoTa")}
          rows={4}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
          placeholder="Nhập mô tả lớp học"
        />
        {errors.MoTa?.message && (
          <p className="text-xs text-red-400">{errors.MoTa.message}</p>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold bg-white text-black mb-2">Lịch Học</p>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2 items-end bg-white text-black"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs">Thứ</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg

-white text-black"
                {...register(`lichlophoc.${index}.Thu`, { valueAsNumber: true })}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    {day === 1 ? "Chủ Nhật" : `Thứ ${day}`}
                  </option>
                ))}
              </select>
              {errors.lichlophoc?.[index]?.Thu?.message && (
                <p className="text-xs text-red-400">{errors.lichlophoc[index].Thu.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 bg-white text-black">
              <label className="text-xs">Giờ Bắt Đầu</label>
              <input
                type="time"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
                {...register(`lichlophoc.${index}.GioBatDau`)}
              />
              {errors.lichlophoc?.[index]?.GioBatDau?.message && (
                <p className="text-xs text-red-400">{errors.lichlophoc[index].GioBatDau.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-400 hover:text-red-600 self-end"
            >
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ Thu: 1, GioBatDau: "08:00" })}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-600 mt-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
          Thêm Lịch
        </button>
        {errors.lichlophoc?.message && (
          <p className="text-xs text-red-400">{errors.lichlophoc.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 w-full sm:w-auto"
      >
        {isSubmitting ? "Đang gửi..." : type === "create" ? "Tạo" : "Cập Nhật"}
      </button>
    </form>
  );
};

export default ClassForm;