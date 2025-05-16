"use client";

import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

type Nutrition = {
  id: number; // idUSER từ user
  nutritionId: number; // idThucDon
  customerName: string; // user.Ten từ hocvien
  trainerName: string; // user.Ten từ huanluyenvien
  goal: string; // TenThucDon hoặc "N/A"
  caloricNeeds: number | null; // SoCalo
  startDate: string; // NgayBatDau
};

const columns = [
  { header: "Nutrition ID", accessor: "nutritionId", className: "w-20" },
  { header: "Customer Name", accessor: "customerName", className: "w-40" },
  { header: "Trainer Name", accessor: "trainerName", className: "w-40 hidden md:table-cell" },
  { header: "Goal", accessor: "goal", className: "w-32 hidden md:table-cell" },
  { header: "Caloric Needs", accessor: "caloricNeeds", className: "w-24 hidden md:table-cell" },
  { header: "Start Date", accessor: "startDate", className: "w-32 hidden md:table-cell" },
  { header: "Actions", accessor: "actions", className: "w-24" },
];

const NutritionManagement = () => {
  const role = "admin";
  const [nutritions, setNutritions] = useState<Nutrition[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [expandedNutritions, setExpandedNutritions] = useState<Nutrition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpandedLoading, setIsExpandedLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const fetchNutritions = async () => {
      try {
        const response = await fetch("/api/admin/nutrition");
        const data = await response.json();
        console.log("Fetched nutritions:", data); // Debug
        // Sort by customer name (A-Z)
        const sortedData = data.sort((a: Nutrition, b: Nutrition) =>
          a.customerName.localeCompare(b.customerName)
        );
        // Get latest nutrition plan per user
        const latestNutritions = Object.values(
          data.reduce((acc: { [key: number]: Nutrition }, curr: Nutrition) => {
            if (!acc[curr.id] || new Date(curr.startDate) > new Date(acc[curr.id].startDate)) {
              acc[curr.id] = curr;
            }
            return acc;
          }, {})
        ) as Nutrition[];
        setNutritions(latestNutritions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching nutritions:", error);
        setLoading(false);
      }
    };

    fetchNutritions();
  }, []);

  const fetchExpandedNutritions = async (userId: number) => {
    setIsExpandedLoading(true);
    try {
      const response =await fetch(`/api/admin/nutrition?userId=${userId}`);
      const data = await response.json();
      console.log("Fetched expanded nutritions:", data); // Debug
      setExpandedNutritions(data);
    } catch (error) {
      console.error("Error fetching expanded nutritions:", error);
      setExpandedNutritions([]);
    } finally {
      setIsExpandedLoading(false);
    }
  };


  const getWeekNutritions = (nutritions: Nutrition[]) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + weekOffset * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return nutritions.filter((nutrition) => {
      const startDate = new Date(nutrition.startDate);
      return startDate >= startOfWeek && startDate <= endOfWeek;
    });
  };

  const renderRow = (item: Nutrition, isExpanded: boolean = false) => (
    <tr
      key={`${item.nutritionId}-${isExpanded}`}
      className={`border-b text-sm ${!isExpanded ? "hover:bg-gray-400 cursor-pointer" : ""}`}
      onClick={() => {
        if (!isExpanded) {
          if (expandedUserId === item.id) {
            setExpandedUserId(null);
            setExpandedNutritions([]);
          } else {
            setExpandedUserId(item.id);
            fetchExpandedNutritions(item.id);
          }
        }
      }}
    >
      <td className="">{item.nutritionId}</td>
      <td className="">{item.customerName}</td>
      <td className=" hidden md:table-cell">{item.trainerName}</td>
      <td className=" hidden md:table-cell">{item.goal}</td>
      <td className=" hidden md:table-cell">{item.caloricNeeds || "N/A"}</td>
      <td className=" hidden md:table-cell">{item.startDate}</td>
      <td className="" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/nutrition/${item.nutritionId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="nutrition" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ THỰC ĐƠN</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {role === "admin" && <FormModal table="nutrition" type="create" />}
          </div>
        </div>
      </div>
      <div className="flex-1">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table
            colums={columns}
            renderRow={(item: Nutrition) => (
              <>
                {renderRow(item, false)}
                {expandedUserId === item.id && (
                  <tr>
                    <td colSpan={7} className="p-4 bg-gray-100">
                      <div className="flex justify-between mb-2">
                        <button
                          onClick={() => setWeekOffset((prev) => prev - 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          Previous Week
                        </button>
                        <button
                          onClick={() => setWeekOffset((prev) => prev + 1)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          Next Week
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        {isExpandedLoading ? (
                          <p className="text-center p-4">Đang tải thực đơn...</p>
                        ) : (
                          <>
                            <table className="w-full text-sm table-auto">
                              <thead>
                                <tr className="border-b bg-gray-200">
                                  {columns.map((col) => (
                                    <th
                                      key={col.accessor}
                                      className={`py-2 text-left ${col.className || ""}`}
                                    >
                                      {col.header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {getWeekNutritions(expandedNutritions).map((nutrition) =>
                                  renderRow(nutrition, true)
                                )}
                              </tbody>
                            </table>
                            {getWeekNutritions(expandedNutritions).length === 0 && (
                              <p className="text-center p-4">Không có thực đơn trong tuần này.</p>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
            data={nutritions}
          />
        )}
      </div>
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default NutritionManagement;