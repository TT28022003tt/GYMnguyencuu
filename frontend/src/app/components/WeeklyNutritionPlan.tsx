"use client";
import { useState } from "react";
import { menu, role } from "../lib/data";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const WeeklyNutritionPlan = () => {
  const Role = role;
  const [menuFood, setMenuFood] = useState(menu);

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        {Role === "admin" && (
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <FormModal table="nutrition" type="create" />
          </div>
        )}
      </div>
      {menuFood.map((plan) => (
        <div key={plan.id} className="mb-8 w-[80%] p-4">
          <div className="flex mr-4">
          <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <FormModal table="nutrition" type="update" data={plan} />
            <FormModal table="nutrition" type="delete" id={plan.id} />
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-300 p-2">Ngày / Bữa</th>
                <th className="border border-gray-300 p-2">Thực đơn</th>
              </tr>
            </thead>
            <tbody>
              {plan.schedule.map((day) => (
                <>
                  <tr key={day.day} className="bg-base-300">
                    <td className="border border-gray-300 p-2 font-semibold hover:bg-gray-400" colSpan={2}>
                      {day.day}
                    </td>
                  </tr>
                  {day.meals.map((meal) => (
                    <tr key={meal.name} className="hover:bg-gray-400">
                      <td className="border border-gray-300 p-2">{meal.name}</td>
                      <td className="border border-gray-300 p-2">{meal.food}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
          
        </div>
      ))}
    </div>
  );
};

export default WeeklyNutritionPlan;
