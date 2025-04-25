"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const schema = z.object({
  eventName: z.string().min(1, { message: "Event name is required!" }),
  startTime: z.string().min(1, { message: "Start time is required!" }),
  endTime: z.string().min(1, { message: "End time is required!" }),
  location: z.string().min(1, { message: "Location is required!" }),
  participantGroup: z.array(z.string()).nonempty({ message: "At least one participant group is required!" }),
  photo: z.instanceof(File, { message: "Photo is required!" }).optional(),
});

type Inputs = z.infer<typeof schema>;

const EventForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Event" : "Update Event"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event Name"
          name="eventName"
          register={register}
          error={errors.eventName}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          register={register}
          error={errors.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          register={register}
          error={errors.endTime}
        />
        <InputField
          label="Location"
          name="location"
          register={register}
          error={errors.location}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Participant Group</label>
        <div className="flex flex-wrap  gap-3">
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" defaultChecked className="checkbox border-2 border-gray-500 rounded-full  " />
              <span className="label-text text-black">Everybody</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox"  className="checkbox border-2 border-gray-500 rounded-full  " />
              <span className="label-text text-black">FIRE</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox"  className="checkbox border-2 border-gray-500 rounded-full  " />
              <span className="label-text text-black">FIRE-PLUS</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox"  className="checkbox border-2 border-gray-500 rounded-full  " />
              <span className="label-text text-black">FIRE-VIP</span>
            </label>
        </div>
        {errors.participantGroup && (
          <p className="text-xs text-red-400">
            {errors.participantGroup.message?.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm flex items-center gap-2 cursor-pointer" htmlFor="photo">
          <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-5 h-5" />
          <span>Upload Event Photo</span>
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          {...register("photo")}
          className="hidden"
        />
        {errors.photo && (
          <p className="text-xs text-red-400">{errors.photo.message?.toString()}</p>
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {type === "create" ? "Create Event" : "Update Event"}
      </button>
    </form>
  );
};

export default EventForm;
