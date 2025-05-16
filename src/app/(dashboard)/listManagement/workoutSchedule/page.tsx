"use client";

import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faCirclePlus, faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

type WorkoutSchedule = {
  id: number;
  scheduleId: number;
  customerName: string;
  trainerName: string;
  programId: number | null;
  startDate: string;
  status: "Ongoing" | "Completed";
};

const columns = [
  { header: "Schedule ID", accessor: "scheduleId", className: "w-20" },
  { header: "Customer Name", accessor: "customerName", className: "w-40" },
  { header: "Trainer Name", accessor: "trainerName", className: "w-40 hidden md:table-cell" },
  { header: "Program ID", accessor: "programId", className: "w-24 hidden md:table-cell" },
  { header: "Start Date", accessor: "startDate", className: "w-32 hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "w-28 hidden md:table-cell" },
  { header: "Actions", accessor: "actions", className: "w-24" },
];

const WorkoutScheduleManagement = () => {
  const role = "admin";
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [expandedSchedules, setExpandedSchedules] = useState<WorkoutSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isExpandedLoading, setIsExpandedLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/admin/schedule");
        const data = await response.json();
        console.log("Fetched schedules:", data); // Debug
        // Sort by customer name (A-Z)
        const sortedData = data.sort((a: WorkoutSchedule, b: WorkoutSchedule) =>
          a.customerName.localeCompare(b.customerName)
        );
        // Get latest schedule per user
        const latestSchedules = Object.values(
          data.reduce((acc: { [key: number]: WorkoutSchedule }, curr: WorkoutSchedule) => {
            if (!acc[curr.id] || new Date(curr.startDate) > new Date(acc[curr.id].startDate)) {
              acc[curr.id] = curr;
            }
            return acc;
          }, {})
        ) as WorkoutSchedule[];
        setSchedules(latestSchedules);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const fetchExpandedSchedules = async (userId: number) => {
    setIsExpandedLoading(true);
    try {
      const response = await fetch(`/api/admin/schedule?userId=${userId}`);
      const data = await response.json();
      console.log("Fetched expanded schedules:", data); // Debug
      setExpandedSchedules(data);
    } catch (error) {
      console.error("Error fetching expanded schedules:", error);
      setExpandedSchedules([]);
    } finally {
      setIsExpandedLoading(false);
    }
  };

  const handleStatusChange = async (scheduleId: number, newStatus: "Ongoing" | "Completed") => {
    try {
      const response = await fetch(`/api/admin/schedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.scheduleId === scheduleId ? { ...schedule, status: newStatus } : schedule
        )
      );
      setExpandedSchedules((prev) =>
        prev.map((schedule) =>
          schedule.scheduleId === scheduleId ? { ...schedule, status: newStatus } : schedule
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getWeekSchedules = (schedules: WorkoutSchedule[]) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + weekOffset * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return schedules.filter((schedule) => {
      const startDate = new Date(schedule.startDate);
      return startDate >= startOfWeek && startDate <= endOfWeek;
    });
  };

  const renderRow = (item: WorkoutSchedule, isExpanded: boolean = false) => (
    <tr
      key={`${item.scheduleId}-${isExpanded}`}
      className={`border-b text-sm ${!isExpanded ? "hover:bg-gray-400 cursor-pointer" : ""}`}
      onClick={() => {
        if (!isExpanded) {
          if (expandedUserId === item.id) {
            setExpandedUserId(null);
            setExpandedSchedules([]);
          } else {
            setExpandedUserId(item.id);
            fetchExpandedSchedules(item.id);
          }
        }
      }}
    >
      <td className="">{item.scheduleId}</td>
      <td className="">{item.customerName}</td>
      <td className=" hidden md:table-cell">{item.trainerName}</td>
      <td className="hidden md:table-cell">{item.programId || "N/A"}</td>
      <td className="hidden md:table-cell">{item.startDate}</td>
      <td className="hidden md:table-cell">
        <select
          value={item.status}
          onChange={(e) =>
            handleStatusChange(item.scheduleId, e.target.value as "Ongoing" | "Completed")
          }
          onClick={(e) => e.stopPropagation()}
          className="border rounded p-1 w-full"
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </td>
      <td className="p-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/workoutSchedule/${item.scheduleId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="workoutSchedule" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ LỊCH TẬP</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {role === "admin" && <FormModal table="workoutSchedule" type="create" />}
          </div>
        </div>
      </div>
      <div className="flex-1">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table
            colums={columns}
            renderRow={(item: WorkoutSchedule) => (
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
                          <p className="text-center p-4">Đang tải lịch tập...</p>
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
                                {getWeekSchedules(expandedSchedules).map((schedule) =>
                                  renderRow(schedule, true)
                                )}
                              </tbody>
                            </table>
                            {getWeekSchedules(expandedSchedules).length === 0 && (
                              <p className="text-center p-4">Không có lịch tập trong tuần này.</p>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
            data={schedules}
          />
        )}
      </div>
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default WorkoutScheduleManagement;