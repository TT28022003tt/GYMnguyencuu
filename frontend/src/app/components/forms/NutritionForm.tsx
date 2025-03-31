"use client";

import { trainerdata } from "@/app/lib/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
  customerName: z.string().min(1, { message: "Customer name is required!" }),
  trainerId: z.string().min(1, { message: "Trainer is required!" }),
  nutritionGoal: z.string().min(1, { message: "Goal is required!" }),
  caloricNeeds: z.coerce.number().min(0, { message: "Caloric needs must be a positive number!" }),
  waterIntake: z.string().min(1, { message: "Water intake is required!" }),
  startDate: z.string().min(1, { message: "Start date is required!" }),
  nutritionPlanName: z.string().optional(),
  notes: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const NutritionForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Nutrition Plan" : "Update Nutrition Plan"}</h1>
      <div className="flex flex-wrap justify-between gap-4">
        <InputField label="Customer Name" name="customerName" register={register} error={errors.customerName} />
        <div className="flex flex-col justify-between w-full md:w-1/4">
          <label className="text-xs">Trainer</label>
          <select
            className="ring-[1.5px] ring-gray-300 bg-white text-black p-2 rounded-md text-sm"
            {...register("trainerId")}
            defaultValue={data?.trainerId || ""}
          >
            <option value="">Select Trainer</option>
            {trainerdata.map((trainer) => (
              <option key={trainer.id} value={trainer.id.toString()}>{trainer.name}</option>
            ))}
          </select>
          {errors.trainerId && <p className="text-xs text-red-400">{errors.trainerId.message}</p>}
        </div>
        <InputField label="Goal" name="nutritionGoal" register={register} error={errors.nutritionGoal} />
        <InputField label="Caloric Needs" name="caloricNeeds" type="number" register={register} error={errors.caloricNeeds} />
        <InputField label="Water Intake" name="waterIntake" register={register} error={errors.waterIntake} />
        <InputField label="Start Date" name="startDate" type="date" register={register} error={errors.startDate} />
        <InputField label="Diet Plan" name="nutritionPlanName" register={register} error={errors.nutritionPlanName} />
        <InputField label="Notes" name="notes" register={register} error={errors.notes} />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
};

export default NutritionForm;
