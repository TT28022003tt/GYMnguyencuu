"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
  const [trainers, setTrainers] = useState<{ idMaHLV: number; name: string }[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || {
      Ten: "",
      SoLuongMax: 1,
      TrangThai: "Đang mở",
      lichlophoc: [{ Thu: 1, GioBatDau: "08:00" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lichlophoc",
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch("/api/huanluyenvien");
        if (res.ok) {
          const data = await res.json();
          setTrainers(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách huấn luyện viên", error);
      }
    };
    fetchTrainers();
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const url = type === "create" ? "/api/admin/class" : `/api/admin/class/${data?.id}`;
      const method = type === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        console.log(`${type === "create" ? "Tạo" : "Cập nhật"} lớp học thành công`);
      } else {
        console.error("Lỗi khi gửi form");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-orange-400">
        {type === "create" ? "Tạo Lớp Học Mới" : "Cập Nhật Lớp Học"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
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
          label="Mô Tả"
          name="MoTa"
          register={register}
          error={errors.MoTa}
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
        <InputField
          label="Phí (VND)"
          name="Phi"
          register={register}
          error={errors.Phi}
          type="number"
        />
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs ">Huấn Luyện Viên</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full "
            {...register("idMaHLV", { valueAsNumber: true })}
          >
            <option value="">Chọn HLV</option>
            {trainers.map((trainer) => (
              <option key={trainer.idMaHLV} value={trainer.idMaHLV}>
                {trainer.name}
              </option>
            ))}
          </select>
          {errors.idMaHLV?.message && (
            <p className="text-xs text-red-400">{errors.idMaHLV.message}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold  mb-2">Lịch Học</p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4 mb-2">
            <div className="flex flex-col gap-2 w-1/3">
              <label className="text-xs ">Thứ</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full "
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
            <div className="flex flex-col gap-2 w-1/3">
              <label className="text-xs ">Giờ Bắt Đầu</label>
              <input
                type="time"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full "
                {...register(`lichlophoc.${index}.GioBatDau`)}
              />
              {errors.lichlophoc?.[index]?.GioBatDau?.message && (
                <p className="text-xs text-red-400">{errors.lichlophoc[index].GioBatDau.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-400 hover:text-red-600"
            >
              <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ Thu: 1, GioBatDau: "08:00" })}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-600"
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
          Thêm Lịch
        </button>
        {errors.lichlophoc?.message && (
          <p className="text-xs text-red-400">{errors.lichlophoc.message}</p>
        )}
      </div>

      <button className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600">
        {type === "create" ? "Tạo" : "Cập Nhật"}
      </button>
    </form>
  );
};

export default ClassForm;