"use client";
import React, { useState, useEffect } from "react";
import { role } from "../lib/data";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const WeeklyNutritionPlan = () => {
  const Role = role;
  const [menuFood, setMenuFood] = useState<any[]>([]);

  const fetchMealPlans = async () => {
    try {
      const res = await fetch("/api/healthconsultation", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched meal plans:", data); 
        setMenuFood(data);
      } else {
        console.error("Lỗi khi lấy danh sách thực đơn");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);


  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        {Role === "admin" && (
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <FormModal table="nutrition" type="create"  />
          </div>
        )}
      </div>
      {menuFood.map((plan) => (
        <div key={plan.idThucDon} className="mb-8 w-[80%] p-4">
          <div className="flex mr-4">
            <h2 className="text-xl font-bold mb-2 mr-6">{plan.TenThucDon}</h2>
            <FormModal
              table="nutrition"
              type="update"
              data={{
                idThucDon: plan.idThucDon,
                TenThucDon: plan.TenThucDon || "",
                SoCalo: plan.SoCalo || 0,
                NgayBatDau: plan.NgayBatDau
                  ? new Date(plan.NgayBatDau).toISOString().split("T")[0]
                  : "",
                MaHV: plan.MaHV || 1,
                chiTietThucDon: plan.chitietthucdon?.map((day: any) => ({
                  idchitietthucdon: day.idchitietthucdon,
                  buaAn: Array.isArray(day.buaan)
                    ? day.buaan.map((meal: any) => ({
                      idBuaAn: meal.idBuaAn,
                      TenBua: meal.TenBua || "",
                      MoTa: meal.MoTa || "",
                    }))
                    : [],
                })) || [],
              }}
              
            />
            <FormModal
              table="nutrition"
              type="delete"
              id={plan.idThucDon}
              onSuccess={fetchMealPlans}
            />
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-300 p-2">Ngày / Bữa</th>
                <th className="border border-gray-300 p-2">Thực đơn</th>
              </tr>
            </thead>
            <tbody>
              {plan.chitietthucdon.map((day: any) => (
                <React.Fragment key={day.idchitietthucdon}>
                  <tr key={day.idchitietthucdon} className="bg-base-300">
                    <td
                      className="border border-gray-300 p-2 font-semibold hover:bg-gray-400"
                      colSpan={2}
                    >
                      {new Date(day.Ngay).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                  {day.buaan.map((meal: any) => (
                    <tr key={meal.idBuaAn} className="hover:bg-gray-400">
                      <td className="border border-gray-300 p-2">{meal.TenBua}</td>
                      <td className="border border-gray-300 p-2">{meal.MoTa}</td>
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
