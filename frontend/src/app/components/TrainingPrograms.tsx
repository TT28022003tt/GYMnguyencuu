"use client";
import { useState } from "react";
import { role, trainingPlans } from "../lib/data";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faFilter } from "@fortawesome/free-solid-svg-icons";

const TrainingPrograms = () => {
  const Role = role;
  const [trainingPlan, setTrainingPlan] = useState(trainingPlans);


  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-14 ">
        LIỆU TRÌNH TẬP (TRAINING PLANS)
      </h1>
      <ul className="steps steps-vertical lg:steps-horizontal">
        <li className="step step-primary">Chưa Được</li>
        <li className="step step-primary">Cũng Cũng</li>
        <li className="step">Ngon</li>
        <li className="step">Xiu MLEMMLEM</li>
      </ul>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        <div className="flex items-center gap-4 self-end">
          <button className="w-8 h-8  flex items-center justify-center">
            <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
          </button>
          {role === "admin" && <FormModal table="training" type="create" />
          }
        </div>
      </div>
      {trainingPlan.map((plan) => (
        <div key={plan.id} className="mb-8 relative p-4  ">
          <h2 className="text-xl font-bold mb-2">{plan.id}. {plan.name}</h2>
          <p className="mb-1"><strong>Mục tiêu:</strong> {plan.goal}</p>
          <p className="mb-2"><strong>Thời gian:</strong> {plan.duration} Tuần</p>
          <ul className="list-disc pl-5">
            {plan.details.map((detail, index) => (
              <li key={index} className="mb-1">
                <strong>{detail.week}:</strong> {detail.description}
              </li>
            ))}
          </ul>

          {Role === "admin" && (
            <div className="absolute top-2 right-2 flex gap-2">
              <FormModal table="training" type="update" data={plan} />
              <FormModal table="training" type="delete" id={plan.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrainingPrograms;
