"use client";

import FormModal from "@/app/components/FormModal";
import NutritionModal from "@/app/components/NutritionModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faEdit, faEye, faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
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
  const [nutritions, setNutritions] = useState<Nutrition[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [expandedNutritions, setExpandedNutritions] = useState<Nutrition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpandedLoading, setIsExpandedLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedNutritionId, setSelectedNutritionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchNutritions = async () => {
    try {
      const response = await fetch("/api/admin/nutrition");
      const data = await response.json();
      const sortedData = data.sort((a: Nutrition, b: Nutrition) =>
        a.customerName.localeCompare(b.customerName)
      );
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
  useEffect(() => {
    fetchNutritions();
  }, []);

  const fetchExpandedNutritions = async (userId: number) => {
    setIsExpandedLoading(true);
    try {
      const response = await fetch(`/api/admin/nutrition?userId=${userId}`);
      const data = await response.json();
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

  const handleViewDetails = (nutritionId: number) => {
    setSelectedNutritionId(nutritionId);
    setIsModalOpen(true);
  };



  const renderRow = (item: Nutrition, isExpanded: boolean = false) => (
    <tr
      key={`${item.nutritionId}-${isExpanded}`}
      className={`border-b text-sm ${!isExpanded ? "hover:bg-gray-300 cursor-pointer" : ""}`}
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
      <td className="hidden md:table-cell">{item.trainerName}</td>
      <td className="hidden md:table-cell">{item.goal}</td>
      <td className="hidden md:table-cell">{item.caloricNeeds || "N/A"}</td>
      <td className="hidden md:table-cell">{item.startDate}</td>
      <td className="" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(item.nutritionId)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-300"
            title="Xem chi tiết"
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5 " />
          </button>
          <FormModal
            table="nutrition"
            type="update"
            data={{
              idThucDon: item.nutritionId,
              TenThucDon: item.goal || "",
              SoCalo: item.caloricNeeds || 0,
              NgayBatDau: item.startDate || new Date().toISOString().split("T")[0],
              MaHV: item.id || 1,
              chiTietThucDon: [], // Sẽ được lấy trong NutritionADForm
            }}
          />
          <FormModal table="nutritionAD" type="delete" id={item.id} onSuccess={fetchNutritions} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0 ">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-orange-400">QUẢN LÝ THỰC ĐƠN</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5 " />
            </button>
            <FormModal table="nutritionAD" type="create" />
          </div>
        </div>
      </div>
      <div className="flex-1">
        {loading ? (
          <p className="">Đang tải...</p>
        ) : (
          <Table
            colums={columns}
            renderRow={(item: Nutrition) => (
              <React.Fragment key={item.id}>
                {renderRow(item, false)}
                {expandedUserId === item.id && (
                  <tr>
                    <td colSpan={7} className="p-4 ">
                      <div className="flex justify-between mb-2">
                        <button
                          onClick={() => setWeekOffset((prev) => prev - 1)}
                          className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Tuần trước
                        </button>
                        <button
                          onClick={() => setWeekOffset((prev) => prev + 1)}
                          className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Tuần sau
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        {isExpandedLoading ? (
                          <p className="text-center p-4 ">Đang tải thực đơn...</p>
                        ) : (
                          <>
                            <table className="w-full text-sm table-auto">
                              <thead>
                                <tr className="border-b ">
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
                              <p className="text-center p-4 text-white">
                                Không có thực đơn trong tuần này.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )}
            data={nutritions}
          />
        )}
      </div>
      <div>
        <Pagination />
      </div>
      {selectedNutritionId && (
        <NutritionModal
          nutritionId={selectedNutritionId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NutritionManagement;