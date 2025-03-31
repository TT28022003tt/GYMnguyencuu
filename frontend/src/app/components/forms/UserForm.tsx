"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFiled from "../InputField";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const schema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  fullname: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  role: z.enum(["admin", "trainer", "customer"], { message: "Role is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  photo: z.instanceof(File, { message: "Photo is required!" }),
});

type Inputs = z.infer<typeof schema>;

const UserForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Account" : "Update user information"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputFiled
          label="Username"
          name="userName"
          defaultValue={data?.userName}
          register={register}
          error={errors?.userName}
        />
        <InputFiled
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
        <InputFiled
          label="Full Name"
          name="name"
          defaultValue={data?.fullName}
          register={register}
          error={errors?.fullname}
        />
        <InputFiled
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputFiled
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputFiled 
        label="Address" 
        name="address" 
        defaultValue={data?.address} 
        register={register} 
        error={errors?.address}
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs">Role</label>
          <select
            className="ring-[1.5px] ring-gray-300 bg-white text-black p-2 rounded-md text-sm w-full"
            {...register("role")}
            defaultValue={data?.role || "customer"}
          >
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
            <option value="customer">Customer</option>
          </select>
          {errors.role?.message && (
            <p className="text-xs text-red-400">{errors.role.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-black">Sex</label>
          <select className= " bg-white ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full "{...register("sex")} defaultValue={data?.sex}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message&&(<p className="text-xs text-red-400">{errors.sex.message.toString()}</p>)}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-end">
          <label className="text-xs flex items-center gap-2 cursor-pointer" htmlFor="photo">
            <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-6 h-6" />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="photo" {...register("photo")} className="hidden" />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">{errors.photo.message.toString()}</p>
          )}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default UserForm;
