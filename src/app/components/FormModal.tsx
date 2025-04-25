"use client";

import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";

const UserForm = dynamic(() => import("./forms/UserForm"), { loading: () => <h1>Loading</h1> });
const WorkoutScheduleForm = dynamic(() => import("./forms/WorkoutScheduleForm"), { loading: () => <h1>Loading</h1> });
const NutritionForm = dynamic(() => import("./forms/NutritionForm"), { loading: () => <h1>Loading</h1> });
const EventForm = dynamic(() => import("./forms/EventForm"), { loading: () => <h1>Loading</h1> });
const ClassForm = dynamic(() => import("./forms/ClassForm"), { loading: () => <h1>Loading</h1> });
const TrainerForm = dynamic(() => import("./forms/TrainerForm"), { loading: () => <h1>Loading</h1> });
const TrainingForm = dynamic(() => import("./forms/TrainingForm"), { loading: () => <h1>Loading</h1> });
const BasicMetricsForm = dynamic(() => import("./forms/BasicMetricsForm"), { loading: () => <h1>Loading</h1> });
const AdvancedMetricsForm = dynamic(() => import("./forms/AdvancedMetricsForm"), { loading: () => <h1>Loading</h1> });

const forms: { [key: string]: (type: "create" | "update", data?: any) => JSX.Element } = {
  training: (type, data) => <TrainingForm type={type} data={data} />,
  user: (type, data) => <UserForm type={type} data={data} />,
  workoutSchedule: (type, data) => <WorkoutScheduleForm type={type} data={data} />,
  nutrition: (type, data) => <NutritionForm type={type} data={data} />,
  event: (type, data) => <EventForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  trainer: (type, data) => <TrainerForm type={type} data={data} />,
  basicmetrics: (type, data) => <BasicMetricsForm type={type} data={data} />,
  advancedmetrics: (type, data) => <AdvancedMetricsForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  onSuccess,
  customButton,
}: {
  table: "user" | "workoutSchedule" | "nutrition" | "event" | "membership" | "feedback" | "class" | "trainer" | "training" | "basicmetrics" | "advancedmetrics";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
  onSuccess?: () => void;
  customButton?: JSX.Element; // Thêm customButton
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const [open, setOpen] = useState(false);
  const Icon = type === "create" ? faPlus : type === "delete" ? faTrashCan : faPenToSquare;

  const getApiPath = (table: string) => {
    switch (table) {
      case "training":
        return "TraniningPlans";
      case "nutrition":
        return "healthconsultation";
      case "user":
        return "users";
      case "trainer":
        return "trainers";
      case "workoutSchedule":
        return "schedule";

      case "basicmetrics":
        return "basicmetrics";
      case "advancedmetrics":
        return "advancedmetrics";
      default:
        return table;
    }
  };

  useEffect(() => {
    const handleFormSuccess = () => {
      setOpen(false);
      onSuccess?.();
    };

    window.addEventListener("formSuccess", handleFormSuccess);
    return () => {
      window.removeEventListener("formSuccess", handleFormSuccess);
    };
  }, [onSuccess]);

  const Form = () => {
    async function handleDelete(e: React.FormEvent) {
      e.preventDefault();
      if (!id) return;

      try {
        const res = await fetch(`/api/${getApiPath(table)}/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert(`${table} deleted successfully!`);
          setOpen(false);
          onSuccess?.();
        } else {
          const error = await res.json();
          alert(`Delete failed: ${error.message || "Unknown error"}`);
        }
      } catch (err) {
        alert("Delete failed: " + err);
      }
    }

    return type === "delete" && id ? (
      <form onSubmit={handleDelete} className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          type="submit"
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      {customButton ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {customButton}
        </div>
      ) : (
        <button
          className={`${size} flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors`}
          onClick={() => setOpen(true)}
        >
          {Icon && <FontAwesomeIcon icon={Icon} className="w-5 h-5 text-gray-700" />}
        </button>
      )}
      {open && (
        <div className="fixed inset-0 w-screen h-screen left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white text-black max-h-[80vh] overflow-auto sm:max-h-screen p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/images/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;