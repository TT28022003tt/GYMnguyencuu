"use client"
import React, { useState } from "react";
import { menu } from "../lib/data";

const WeeklyNutritionPlan = () => {
  const [menuFood, setMenuFood] = useState(menu)
  return (
    <div className="overflow-x-auto p-4 md:pl-28 md:pr-28">
      {menuFood.map((plan) => (
        <div key={plan.id} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
          <table className="w-full border-collapse border border-gray-300 ">
            <thead>
              <tr className="bg-accent">
                <th className="border border-gray-300 p-2">Ngày / Bữa</th>
                <th className="border border-gray-300 p-2">Thực đơn</th>
              </tr>
            </thead>
            <tbody>
              {plan.schedule.map((day) => (
                <React.Fragment key={day.day}>
                  <tr className="bg-base-300">
                    <td className="border border-gray-300 p-2 font-semibold hover:bg-secondary" colSpan={2}>
                      {day.day}
                    </td>
                  </tr>
                  {day.meals.map((meal) => (
                    <tr key={meal.name} className="hover:bg-secondary">
                      <td className="border border-gray-300 p-2">{meal.name}</td>
                      <td className="border border-gray-300 p-2">{meal.food}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default WeeklyNutritionPlan;

