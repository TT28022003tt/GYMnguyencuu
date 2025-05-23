"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
  idUser: z.number().min(1, { message: "Người dùng là bắt buộc" }),
  idMaGT: z.number().min(1, { message: "Gói tập là bắt buộc" }),
  idMaHLV: z.number().min(1, { message: "Huấn luyện viên là bắt buộc" }),
  SoThang: z.number().min(1, { message: "Số tháng phải lớn hơn 0" }).optional(),
  TongTien: z.number().min(0, { message: "Tổng tiền không được âm" }).optional(),
  NgayDangKy: z.string().min(1, { message: "Ngày đăng ký là bắt buộc" }).optional(),
  NgayHetHan: z.string().min(1, { message: "Ngày hết hạn là bắt buộc" }).optional(),
  TinhTrang: z.number().min(0).max(1, { message: "Trạng thái phải là 0 hoặc 1" }).optional(),
});

type Inputs = z.infer<typeof schema>;

interface MembershipFormProps {
  type: "create" | "update";
  data?: Inputs & { id?: number; TongTien?: number; NgayDangKy?: string; NgayHetHan?: string };
}

const MembershipForm = ({ type, data }: MembershipFormProps) => {
  const [users, setUsers] = useState<{ idUser: number; Ten: string }[]>([]);
  const [packages, setPackages] = useState<{ idMaGT: number; Ten: string; Gia?: number }[]>([]);
  const [trainers, setTrainers] = useState<{ idMaHLV: number; Ten: string }[]>([]);
  const [tongTienDisplay, setTongTienDisplay] = useState<string>("");
  const [ngayHetHan, setNgayHetHan] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      idUser: undefined,
      idMaGT: undefined,
      idMaHLV: undefined,
      SoThang: 1,
      TinhTrang: 1,
    },
  });
  const idUser = watch("idUser");
  const idMaGT = watch("idMaGT");
  const soThang = watch("SoThang");

  // Fetch users, packages, and trainers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, packagesRes, trainersRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/goitap"),
          fetch("/api/huanluyenvien"),
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (packagesRes.ok) setPackages(await packagesRes.json());
        if (trainersRes.ok) setTrainers(await trainersRes.json());
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Reset form for update mode
  useEffect(() => {
    if (type === "update" && data) {
      console.log("Form data:", data);
      reset({
        idUser: data.idUser ?? undefined,
        idMaGT: data.idMaGT ?? undefined,
        idMaHLV: data.idMaHLV ?? undefined,
        SoThang: data.SoThang ?? 1,
        TinhTrang: data.TinhTrang ?? 1,
      });
      if (data.TongTien) {
        setTongTienDisplay(data.TongTien.toLocaleString("vi-VN"));
      }
      if (data.NgayHetHan) {
        setNgayHetHan(data.NgayHetHan);
      }
    }
  }, [data, type, reset]);
  useEffect(() => {
    if ((type === "create" || "update") && idUser) {
      const checkDuplicateUser = async () => {
        try {
          const response = await fetch(`/api/admin/membership/check?idUser=${idUser}`);
          if (!response.ok) {
            const errorData = await response.json();
            setUserError(errorData.error || "Lỗi khi kiểm tra người dùng");
          } else {
            setUserError(null);
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra người dùng:", error);
          setUserError("Lỗi khi kiểm tra người dùng");
        }
      };
      checkDuplicateUser();
    } else {
      setUserError(null);
    }
  }, [idUser, type]);

  useEffect(() => {
    if (idMaGT && soThang) {
      const selectedPackage = packages.find((pkg) => pkg.idMaGT === idMaGT);
      if (selectedPackage?.Gia) {
        const tongTien = selectedPackage.Gia * soThang;
        setTongTienDisplay(tongTien.toLocaleString("vi-VN"));
        setValue("TongTien", tongTien);
      }

      let ngayDangKy: Date;

      if (type === "create") {
        ngayDangKy = new Date();
      } else if (data?.NgayDangKy && !isNaN(Date.parse(data.NgayDangKy))) {
        ngayDangKy = new Date(data.NgayDangKy);
      } else {
        console.warn("Ngày đăng ký không hợp lệ, fallback về ngày hiện tại.");
        ngayDangKy = new Date();
      }

      const ngayHetHanDate = new Date(ngayDangKy);
      ngayHetHanDate.setMonth(ngayHetHanDate.getMonth() + soThang);

      if (!isNaN(ngayHetHanDate.getTime())) {
        const ngayHetHanStr = ngayHetHanDate.toISOString().split("T")[0];
        setNgayHetHan(ngayHetHanStr);
        setValue("NgayHetHan", ngayHetHanStr);
      } else {
        console.error("Lỗi khi tính ngày hết hạn.");
        setNgayHetHan("");
        setValue("NgayHetHan", "");
      }
    } else {
      setTongTienDisplay("");
      setNgayHetHan("");
    }
  }, [idMaGT, soThang, packages, setValue, type, data]);

  const onSubmit = async (formData: Inputs) => {
    if (userError) {
      alert(userError);
      return;
    }

    console.log("Form data submitted:", formData);
    setIsSubmitting(true);
    try {
      const ngayDangKy = type === "create" ? new Date().toISOString().split("T")[0] : data?.NgayDangKy;
      const tongTien = packages.find((pkg) => pkg.idMaGT === formData.idMaGT)?.Gia! * (formData.SoThang || 1);

      const payload = {
        idUser: formData.idUser,
        idMaGT: formData.idMaGT,
        idMaHLV: formData.idMaHLV,
        SoThang: formData.SoThang,
        TongTien: tongTien,
        NgayDangKy: ngayDangKy,
        NgayHetHan: ngayHetHan,
        TinhTrang: formData.TinhTrang,
      };

      const url = type === "create" ? "/api/admin/membership" : `/api/admin/membership/${data?.id}`;
      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Lỗi khi gửi dữ liệu gói tập");

      alert(`${type === "create" ? "Tạo" : "Cập nhật"} gói tập thành công!`);

      window.dispatchEvent(new CustomEvent("refreshMembershipList"));
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
        {type === "create" ? "Tạo Gói Tập Mới" : "Cập Nhật Gói Tập"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs">Người Dùng</label>
          <Controller
            name="idUser"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
              >
                <option value="">Chọn người dùng</option>
                {users.length > 0 ? (
                  users.map((user) => (
                    <option key={user.idUser} value={user.idUser}>
                      {user.Ten}
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
          {errors.idUser?.message && (
            <p className="text-xs text-red-400">{errors.idUser.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs">Gói Tập</label>
          <Controller
            name="idMaGT"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
              >
                <option value="">Chọn gói tập</option>
                {packages.length > 0 ? (
                  packages.map((pkg) => (
                    <option key={pkg.idMaGT} value={pkg.idMaGT}>
                      {pkg.Ten} ({pkg.Gia?.toLocaleString("vi-VN")} VND/tháng)
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
          {errors.idMaGT?.message && (
            <p className="text-xs text-red-400">{errors.idMaGT.message}</p>
          )}
        </div>
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
        <InputField
          label="Số Tháng"
          name="SoThang"
          register={register}
          error={errors.SoThang}
          type="number"
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs">Tổng Tiền (VND)</label>
          <p className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 text-black">
            {tongTienDisplay || "Chưa chọn gói tập"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs">Ngày Đăng Ký</label>
          <p className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 text-black">
            {type === "create" ? new Date().toLocaleDateString("vi-VN") : data?.NgayDangKy || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs">Ngày Hết Hạn</label>
          <p className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 text-black">
            {ngayHetHan ? new Date(ngayHetHan).toLocaleDateString("vi-VN") : "Chưa chọn gói tập"}
          </p>
        </div>
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

export default MembershipForm;