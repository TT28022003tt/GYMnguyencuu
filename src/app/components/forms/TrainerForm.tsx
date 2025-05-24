"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
  ten: z.string().min(1, { message: "Tên là bắt buộc" }),
  ngaySinh: z.string().min(1, { message: "Ngày sinh là bắt buộc" }),
  gioiTinh: z.number().min(0).max(1, { message: "Giới tính không hợp lệ" }),
  diaChi: z.string().optional(),
  soDienThoai: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10,11}$/.test(val),
      { message: "Số điện thoại không hợp lệ" }
    ),
  email: z.string().email({ message: "Email không hợp lệ" }),
  chungChi: z.string().optional(),
  bangCap: z.string().optional(),
  chuyenMon: z.string().optional(),
  luong: z.number().optional(),
  photo: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

interface TrainerFormProps {
  type: "create" | "update";
  data?: Inputs & { id?: number; idMaHLV?: number };
}

const TrainerForm = ({ type, data }: TrainerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      ten: "",
      ngaySinh: "",
      gioiTinh: 1,
      diaChi: "",
      soDienThoai: "",
      email: "",
      chungChi: "",
      bangCap: "",
      chuyenMon: "",
      luong: 0,
      photo: "/images/default-avatar.png",
    },
  });

  useEffect(() => {
    if (type === "update" && data) {
      reset({
        ten: data.ten || "",
        ngaySinh: data.ngaySinh || "",
        gioiTinh: data.gioiTinh ?? 1,
        diaChi: data.diaChi || "",
        soDienThoai: data.soDienThoai || "",
        email: data.email || "",
        chungChi: data.chungChi || "",
        bangCap: data.bangCap || "",
        chuyenMon: data.chuyenMon || "",
        luong: data.luong || 0,
        photo: data.photo || "/images/default-avatar.png",
      });
    }
  }, [data, type, reset]);

  const onSubmit = async (formData: Inputs) => {
    setIsSubmitting(true);
    try {
      const url = type === "create" ? "/api/admin/trainer" : `/api/admin/trainer/${data?.id}`;
      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Lỗi khi gửi dữ liệu huấn luyện viên");

      alert(`${type === "create" ? "Tạo" : "Cập nhật"} huấn luyện viên thành công!`);
      window.dispatchEvent(new CustomEvent("refreshTrainerList"));
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
        {type === "create" ? "Tạo Huấn Luyện Viên Mới" : "Cập Nhật Huấn Luyện Viên"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Tên"
          name="ten"
          register={register}
          error={errors.ten}
          type="text"
        />
        <InputField
          label="Ngày Sinh"
          name="ngaySinh"
          register={register}
          error={errors.ngaySinh}
          type="date"
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs">Giới Tính</label>
          <select
            {...register("gioiTinh", { valueAsNumber: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
          >
            <option value={1}>Nam</option>
            <option value={0}>Nữ</option>
          </select>
          {errors.gioiTinh?.message && (
            <p className="text-xs text-red-400">{errors.gioiTinh.message}</p>
          )}
        </div>
        <InputField
          label="Địa Chỉ"
          name="diaChi"
          register={register}
          error={errors.diaChi}
          type="text"
        />
        <InputField
          label="Số Điện Thoại"
          name="soDienThoai"
          register={register}
          error={errors.soDienThoai}
          type="text"
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors.email}
          type="email"
        />
        <InputField
          label="Chứng Chỉ"
          name="chungChi"
          register={register}
          error={errors.chungChi}
          type="text"
        />
        <InputField
          label="Bằng Cấp"
          name="bangCap"
          register={register}
          error={errors.bangCap}
          type="text"
        />
        <InputField
          label="Chuyên Môn"
          name="chuyenMon"
          register={register}
          error={errors.chuyenMon}
          type="text"
        />
        <InputField
          label="Lương (VND)"
          name="luong"
          register={register}
          error={errors.luong}
          type="number"
        />
        <InputField
          label="Ảnh Đại Diện (URL)"
          name="photo"
          register={register}
          error={errors.photo}
          type="text"
        />
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

export default TrainerForm;