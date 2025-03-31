"use client"
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import Image from "next/image";
import { JSX, useState } from "react";

const UserForm = dynamic(() => import("./forms/UserForm"), { loading: () => <h1>Loading</h1> });
const WorkoutScheduleForm = dynamic(() => import("./forms/WorkoutScheduleForm"), { loading: () => <h1>Loading</h1> });
const NutritionForm = dynamic(() => import("./forms/NutritionForm"), { loading: () => <h1>Loading</h1> });
const EventForm = dynamic(() => import("./forms/EventForm"), { loading: () => <h1>Loading</h1> });
const ClassForm = dynamic(() => import("./forms/ClassForm"), { loading: () => <h1>Loading</h1> });

const forms: { [key: string]: (type: "create" | "update", data?: any) => JSX.Element } = {
  user: (type, data) => <UserForm type={type} data={data} />, 
  workoutSchedule: (type, data) => <WorkoutScheduleForm type={type} data={data} />, 
  nutrition: (type, data) => <NutritionForm type={type} data={data} />, 
  event: (type, data) => <EventForm type={type} data={data} />, 
  class: (type, data) => <ClassForm type={type} data={data} />, 
};

const FormModal = ({
  table, type, data, id,
}: {
  table: "user" | "workoutSchedule" | "nutrition" | "event" | "membership" | "feedback" | "class";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = type === "create" ? "text-white" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple";
  const [open, setOpen] = useState(false);
  const Icon = type === "create" ? faPlus : type === "delete" ? faTrashCan : null;
  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this {table}?</span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };
  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {Icon && <FontAwesomeIcon icon={Icon} className="w-5 h-5" />}
      </button>
      {open && (
        <div className=" fixed inset-0 w-screen h-screen  left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center ">
          <div className="bg-white text-black max-h-[80vh] overflow-auto sm:max-h-screen p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w[40%] ">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/images/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
