"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { format } from "date-fns";

const scheduleSchema = z.object({
  NgayGioBatDau: z.string().min(1, "Thời gian bắt đầu không được để trống"),
  NgayGioKetThuc: z.string().min(1, "Thời gian kết thúc không được để trống"),
  MaHV: z.number({ required_error: "Vui lòng chọn học viên" }).min(1),
  MaHLV: z.number({ required_error: "Vui lòng chọn huấn luyện viên" }).min(1),
  idMaGT: z.number().nullable().optional(),
  idMaCTT: z.number().nullable().optional(),
  idMaLH: z.number().nullable().optional(),
  GhiChu: z.string().nullable().optional(),
  baitap: z
    .array(
      z.object({
        name: z.string().min(1, "Tên bài tập không được để trống"),
        muscleGroup: z.string().nullable().optional(),
        reps: z.number().nullable().optional(),
        sets: z.number().nullable().optional(),
        description: z.string().nullable().optional(),
      })
    )
    .min(1, "Phải có ít nhất một bài tập"),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface WorkoutScheduleFormProps {
  type: "create" | "update";
  data?: any;
}

const WorkoutScheduleForm: React.FC<WorkoutScheduleFormProps> = ({ type, data }) => {
  const [hocvienList, setHocvienList] = useState<{ idMaHV: number; Ten: string }[]>([]);
  const [huanluyenvienList, setHuanluyenvienList] = useState<{ idMaHLV: number; Ten: string }[]>([]);
  const [goitapList, setGoitapList] = useState<{ idMaGT: number; Ten: string }[]>([]);
  const [chuongtrinhtapList, setChuongtrinhtapList] = useState<{ idMaCTT: number; TenCTT: string }[]>([]);
  const [lophocList, setLophocList] = useState<{ idMaLH: number; Ten: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      NgayGioBatDau: "",
      NgayGioKetThuc: "",
      MaHV: undefined,
      MaHLV: undefined,
      idMaGT: null,
      idMaCTT: null,
      idMaLH: null,
      GhiChu: "",
      baitap: [{ name: "", muscleGroup: "", reps: null, sets: null, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "baitap",
  });

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const endpoints = [
        "/api/hocvien",
        "/api/huanluyenvien",
        "/api/goitap",
        "/api/chuongtrinhtap",
        "/api/lophoc",
      ];
      const results = await Promise.allSettled(
        endpoints.map(async (url) => {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`Lỗi ${url}: ${res.status}`);
          return res.json();
        })
      );

      const [hocvienData, huanluyenvienData, goitapData, chuongtrinhtapData, lophocData] = results.map(
        (result, index) => {
          if (result.status === "fulfilled") {
            return result.value;
          }
          console.error(`Lỗi ${endpoints[index]}:`, result.reason);
          return [];
        }
      );

      setHocvienList(hocvienData || []);
      setHuanluyenvienList(huanluyenvienData || []);
      setGoitapList(goitapData || []);
      setChuongtrinhtapList(chuongtrinhtapData || []);
      setLophocList(lophocData || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (type === "update" && data) {
      reset({
        NgayGioBatDau: data.NgayGioBatDau
          ? format(new Date(data.NgayGioBatDau), "yyyy-MM-dd'T'HH:mm")
          : "",
        NgayGioKetThuc: data.NgayGioKetThuc
          ? format(new Date(data.NgayGioKetThuc), "yyyy-MM-dd'T'HH:mm")
          : "",
        MaHV: data.MaHV ?? undefined,
        MaHLV: data.MaHLV ?? undefined,
        idMaGT: data.idMaGT ?? null,
        idMaCTT: data.idMaCTT ?? null,
        idMaLH: data.idMaLH ?? null,
        GhiChu: data.GhiChu ?? "",
        baitap:
          data.baitap && data.baitap.length > 0
            ? data.baitap.map((bt: any) => ({
                name: bt.name ?? "",
                muscleGroup: bt.muscleGroup ?? "",
                reps: bt.reps ?? null,
                sets: bt.sets ?? null,
                description: bt.description ?? "",
              }))
            : [{ name: "", muscleGroup: "", reps: null, sets: null, description: "" }],
      });
    }
  }, [data, type, reset]);

  const onSubmit = async (formData: ScheduleFormData) => {
    try {
      setLoading(true);
      const url = type === "create" ? "/api/schedule" : `/api/schedule/${data.id}`;
      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        cache: "no-store",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || (type === "create" ? "Không thể tạo lịch tập" : "Không thể cập nhật lịch tập"));
      }

      toast.success(type === "create" ? "Tạo lịch tập thành công!" : "Cập nhật lịch tập thành công!");
      reset();
      window.dispatchEvent(new Event("formSuccess"));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4">
        {type === "create" ? "Tạo Lịch Tập" : "Cập Nhật Lịch Tập"}
      </h2>

      {/* Thời gian bắt đầu */}
      <div>
        <label className="block text-sm font-medium">Thời gian bắt đầu</label>
        <Controller
          name="NgayGioBatDau"
          control={control}
          render={({ field }) => (
            <input
              type="datetime-local"
              {...field}
              className="mt-1 block w-full border rounded-md p-2"
            />
          )}
        />
        {errors.NgayGioBatDau && (
          <p className="text-red-500 text-sm mt-1">{errors.NgayGioBatDau.message}</p>
        )}
      </div>

      {/* Thời gian kết thúc */}
      <div>
        <label className="block text-sm font-medium">Thời gian kết thúc</label>
        <Controller
          name="NgayGioKetThuc"
          control={control}
          render={({ field }) => (
            <input
              type="datetime-local"
              {...field}
              className="mt-1 block w-full border rounded-md p-2"
            />
          )}
        />
        {errors.NgayGioKetThuc && (
          <p className="text-red-500 text-sm mt-1">{errors.NgayGioKetThuc.message}</p>
        )}
      </div>

      {/* Học viên */}
      <div>
        <label className="block text-sm font-medium">Học viên</label>
        <Controller
          name="MaHV"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Chọn học viên</option>
              {hocvienList.map((hv) => (
                <option key={hv.idMaHV} value={hv.idMaHV}>
                  {hv.Ten}
                </option>
              ))}
            </select>
          )}
        />
        {errors.MaHV && <p className="text-red-500 text-sm mt-1">{errors.MaHV.message}</p>}
      </div>

      {/* Huấn luyện viên */}
      <div>
        <label className="block text-sm font-medium">Huấn luyện viên</label>
        <Controller
          name="MaHLV"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Chọn HLV</option>
              {huanluyenvienList.map((hlv) => (
                <option key={hlv.idMaHLV} value={hlv.idMaHLV}>
                  {hlv.Ten}
                </option>
              ))}
            </select>
          )}
        />
        {errors.MaHLV && <p className="text-red-500 text-sm mt-1">{errors.MaHLV.message}</p>}
      </div>

      {/* Gói tập */}
      <div>
        <label className="block text-sm font-medium">Gói tập (Tùy chọn)</label>
        <Controller
          name="idMaGT"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Không chọn</option>
              {goitapList.map((gt) => (
                <option key={gt.idMaGT} value={gt.idMaGT}>
                  {gt.Ten}
                </option>
              ))}
            </select>
          )}
        />
        {errors.idMaGT && <p className="text-red-500 text-sm mt-1">{errors.idMaGT.message}</p>}
      </div>

      {/* Chương trình tập */}
      <div>
        <label className="block text-sm font-medium">Chương trình tập (Tùy chọn)</label>
        <Controller
          name="idMaCTT"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Không chọn</option>
              {chuongtrinhtapList.map((ctt) => (
                <option key={ctt.idMaCTT} value={ctt.idMaCTT}>
                  {ctt.TenCTT}
                </option>
              ))}
            </select>
          )}
        />
        {errors.idMaCTT && <p className="text-red-500 text-sm mt-1">{errors.idMaCTT.message}</p>}
      </div>

      {/* Lớp học */}
      <div>
        <label className="block text-sm font-medium">Lớp học (Tùy chọn)</label>
        <Controller
          name="idMaLH"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Không chọn</option>
              {lophocList.map((lh) => (
                <option key={lh.idMaLH} value={lh.idMaLH}>
                  {lh.Ten}
                </option>
              ))}
            </select>
          )}
        />
        {errors.idMaLH && <p className="text-red-500 text-sm mt-1">{errors.idMaLH.message}</p>}
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium">Ghi chú (Tùy chọn)</label>
        <Controller
          name="GhiChu"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              value={field.value ?? ""}
              className="mt-1 block w-full border rounded-md p-2"
              rows={4}
            />
          )}
        />
        {errors.GhiChu && <p className="text-red-500 text-sm mt-1">{errors.GhiChu.message}</p>}
      </div>

      {/* Danh sách bài tập */}
      <div>
        <label className="block text-sm font-medium">Danh sách bài tập</label>
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-md p-4 mb-4 space-y-2">
            <div>
              <label className="block text-sm font-medium">Tên bài tập</label>
              <Controller
                name={`baitap.${index}.name`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="mt-1 block w-full border rounded-md p-2"
                    placeholder="Nhập tên bài tập"
                  />
                )}
              />
              {errors.baitap?.[index]?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.baitap[index].name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Nhóm cơ (Tùy chọn)</label>
              <Controller
                name={`baitap.${index}.muscleGroup`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? ""}
                    className="mt-1 block w-full border rounded-md p-2"
                    placeholder="Nhập nhóm cơ"
                  />
                )}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Số hiệp (Tùy chọn)</label>
                <Controller
                  name={`baitap.${index}.sets`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="mt-1 block w-full border rounded-md p-2"
                      placeholder="Nhập số hiệp"
                    />
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Số lần (Tùy chọn)</label>
                <Controller
                  name={`baitap.${index}.reps`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="mt-1 block w-full border rounded-md p-2"
                      placeholder="Nhập số lần"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Mô tả (Tùy chọn)</label>
              <Controller
                name={`baitap.${index}.description`}
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value ?? ""}
                    className="mt-1 block w-full border rounded-md p-2"
                    placeholder="Nhập mô tả"
                  />
                )}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Xóa bài tập
            </button>
          </div>
        ))}
        {errors.baitap && <p className="text-red-500 text-sm mt-1">{errors.baitap.message}</p>}
        <button
          type="button"
          onClick={() => append({ name: "", muscleGroup: "", reps: null, sets: null, description: "" })}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Thêm bài tập
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`bg-green-500 text-white px-4 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Đang xử lý..." : type === "create" ? "Tạo" : "Cập nhật"}
        </button>
      </div>
    </form>
  );
};

export default WorkoutScheduleForm;