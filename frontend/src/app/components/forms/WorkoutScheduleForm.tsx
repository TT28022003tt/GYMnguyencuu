"use client";

import { trainerdata } from "@/app/lib/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required!" }),
  trainerName: z.string().min(1, { message: "Trainer name is required!" }),
  sessionProgress: z.string().min(1, { message: "Session progress is required!" }),
  startDate: z.string().min(1, { message: "Start date is required!" }),
  notes: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const WorkoutScheduleForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Workout Schedule" : "Update Workout Schedule"}</h1>
      <div className="flex flex-wrap justify-between gap-4">
        <InputField label="Customer Name" name="customerName" register={register} error={errors.customerName} />
        <div className="flex flex-col justify-between w-full md:w-1/4">
          <label className="text-xs">Trainer Name</label>
          <select className="ring-[1.5px] ring-gray-300 bg-white text-black p-2 rounded-md text-sm" {...register("trainerName")} defaultValue={data?.trainerName || ""}>
            <option value="">Select Trainer</option>
            {trainerdata.map((trainer) => (
              <option key={trainer.id} value={trainer.name}>{trainer.name}</option>
            ))}
          </select>
          {errors.trainerName && <p className="text-xs text-red-400">{errors.trainerName.message}</p>}
        </div>
        <InputField label="Session Progress" name="sessionProgress" register={register} error={errors.sessionProgress} />
        <InputField label="Start Date" name="startDate" type="date" register={register} error={errors.startDate} />
        <InputField label="Notes" name="notes" register={register} error={errors.notes} />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
};

export default WorkoutScheduleForm;
