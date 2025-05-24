"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  TenDangNhap: z
    .string()
    .min(3, { message: "Tên đăng nhập phải dài ít nhất 3 ký tự!" })
    .max(20, { message: "Tên đăng nhập tối đa 20 ký tự!" }),
  password: z
    .string()
    .min(8, { message: "Mật khẩu phải dài ít nhất 8 ký tự!" })
    .optional()
    .or(z.literal("")),
  fullName: z.string().min(1, { message: "Họ tên là bắt buộc!" }),
  email: z.string().email({ message: "Email không hợp lệ!" }),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ!" })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  role: z.enum(["admin", "trainer", "HocVien"], { message: "Vai trò là bắt buộc!" }),
  sex: z.union([z.literal(0), z.literal(1)]).refine(val => val === 0 || val === 1, {
    message: "Giới tính là bắt buộc!",
  }),
  photo: z.any().optional(),
});

type Inputs = z.infer<typeof schema>;

interface UserFormProps {
  type: "create" | "update";
  data?: Inputs & { id?: number };
}

const UserForm = ({ type, data }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(data?.photo || null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      TenDangNhap: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      birthDate: "",
      role: "HocVien",
      sex: 1,
      photo: null,
    },
  });

  useEffect(() => {
    if (type === "update" && data) {
      reset({
        TenDangNhap: data.TenDangNhap || "",
        password: "",
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        birthDate: data.birthDate || "",
        role: data.role || "HocVien",
        sex: data.sex || 1,
        photo: data.photo || "/images/default-avatar.png",
      });
      setPreviewImage(data.photo || "/images/default-avatar.png");
    }
  }, [data, type, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const filetypes = /jpeg|jpg|png|gif/;
      if (!filetypes.test(file.type)) {
        alert("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("photo", file);
    }
  };

  const onSubmit = async (formData: Inputs) => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tenDangNhap", formData.TenDangNhap);
      if (formData.password) formDataToSend.append("password", formData.password);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("birthDate", formData.birthDate || "");
      formDataToSend.append("role", formData.role);
      formDataToSend.append("sex", formData.sex.toString());
      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      } else {
        formDataToSend.append("photo", formData.photo || "/images/default-avatar.png");
      }
      if (type === "update" && data?.id) {
        formDataToSend.append("id", data.id.toString());
      }

      const url = type === "create" ? "/api/admin/users" : `/api/admin/users/${data?.id}`;
      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi gửi dữ liệu người dùng");
      }

      alert(`${type === "create" ? "Tạo" : "Cập nhật"} người dùng thành công!`);
      window.dispatchEvent(new CustomEvent("refreshUserList"));
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
        {type === "create" ? "Tạo Tài Khoản Mới" : "Cập Nhật Thông Tin Người Dùng"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Tên Đăng Nhập"
          name="tenDangNhap"
          register={register}
          error={errors.TenDangNhap}
          type="text"
        />
        {type === "create" && (
          <InputField
            label="Mật Khẩu"
            name="password"
            type="password"
            register={register}
            error={errors.password}
          />
        )}
        <InputField
          label="Họ Tên"
          name="fullName"
          register={register}
          error={errors.fullName}
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
          label="Số Điện Thoại"
          name="phone"
          register={register}
          error={errors.phone}
          type="text"
        />
        <InputField
          label="Địa Chỉ"
          name="address"
          register={register}
          error={errors.address}
          type="text"
        />
        <InputField
          label="Ngày Sinh"
          name="birthDate"
          register={register}
          error={errors.birthDate}
          type="date"
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs">Vai Trò</label>
          <select
            {...register("role")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
          >
            <option value="admin">Admin</option>
            <option value="trainer">Huấn Luyện Viên</option>
            <option value="HocVien">Học Viên</option>
          </select>
          {errors.role?.message && (
            <p className="text-xs text-red-400">{errors.role.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs">Giới Tính</label>
          <select
            {...register("sex")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
          >
            <option value="1">Nam</option>
            <option value="0">Nữ</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs">Ảnh Đại Diện</label>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleImageChange}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white text-black"
          />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">{String(errors.photo.message)}</p>
          )}
          {previewImage && (
            <div className="mt-2">
              <Image
                src={previewImage}
                alt="Preview"
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
            </div>
          )}
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

export default UserForm;