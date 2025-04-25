"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputFiled from "../InputField";
import { trainerdata } from "@/app/lib/data";

const schema = z.object({
  className: z.string().min(1, { message: "Class Name is required!" }),
  startTime: z.string().min(1, { message: "Start Time is required!" }),
  endTime: z.string().min(1, { message: "End Time is required!" }),
  sessionDuration: z.string().min(1, { message: "Session Duration is required!" }),
  location: z.string().min(1, { message: "Location is required!" }),
  trainerName: z.string().min(1, { message: "Trainer is required!" }),
  maxStudents: z.coerce.number().min(1, { message: "Max students must be at least 1!" }),
  fee: z.coerce.number().min(0, { message: "Fee must be greater than or equal to 0!" }),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
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
        {type === "create" ? "Create a New Class" : "Update Class Information"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputFiled
          label="Class Name"
          name="className"
          defaultValue={data?.className}
          register={register}
          error={errors?.className}
        />
        <InputFiled
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
        />
        <InputFiled
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
        />
        <InputFiled
          label="Session Duration (minutes)"
          name="sessionDuration"
          defaultValue={data?.sessionDuration}
          register={register}
          error={errors?.sessionDuration}
        />
        <InputFiled
          label="Location"
          name="location"
          defaultValue={data?.location}
          register={register}
          error={errors?.location}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs">Trainer</label>
          <select
            className="ring-[1.5px] ring-gray-300 bg-white text-black p-2 rounded-md text-sm w-full"
            {...register("trainerName")}
            defaultValue={data?.trainerName || ""}
          >
            <option value="">Select Trainer</option>
            {trainerdata.map((trainer) => (
              <option key={trainer.id} value={trainer.name}>
                {trainer.name}
              </option>
            ))}
          </select>
          {errors.trainerName?.message && (
            <p className="text-xs text-red-400">{errors.trainerName.message.toString()}</p>
          )}
        </div>
        <InputFiled
          label="Max Students"
          name="maxStudents"
          type="number"
          defaultValue={data?.maxStudents}
          register={register}
          error={errors?.maxStudents}
        />
        <InputFiled
          label="Fee ($)"
          name="fee"
          type="number"
          defaultValue={data?.fee}
          register={register}
          error={errors?.fee}
        />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
