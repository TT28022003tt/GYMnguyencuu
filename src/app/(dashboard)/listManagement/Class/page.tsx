"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter, faEdit } from "@fortawesome/free-solid-svg-icons";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import ClassDetailModal from "@/app/components/ClassDetailModal";
import { useSession } from "next-auth/react";

type Class = {
  id: number;
  className: string;
  startTime: string;
  endTime: string;
  sessionDuration: string;
  location: string;
  trainerName: string;
  trainerEmail: string;
  photo: string;
  currentStudents: number;
  maxStudents: number;
  fee: string;
  type: string;
  status: string;
  description: string;
  schedules: { day: number; startTime: string }[];
};

const columns = [
  { header: "Mã Lớp", accessor: "id", className: "hidden md:table-cell" },
  { header: "Tên Lớp", accessor: "className", className: "hidden md:table-cell" },
  { header: "Huấn Luyện Viên", accessor: "trainer" },
  { header: "Bắt Đầu", accessor: "startTime", className: "hidden md:table-cell" },
  { header: "Kết Thúc", accessor: "endTime", className: "hidden md:table-cell" },
  { header: "Thời Lượng", accessor: "sessionDuration", className: "hidden lg:table-cell" },
  { header: "Phòng", accessor: "location", className: "hidden lg:table-cell" },
  { header: "Số Học Viên", accessor: "studentCount", className: "hidden lg:table-cell" },
  { header: "Phí", accessor: "fee", className: "hidden lg:table-cell" },
  { header: "Hành Động", accessor: "action" },
];

const ClassManagement = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/class");
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        } else {
          console.error("Lỗi khi lấy danh sách lớp học");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleViewDetails = (id: number) => {
    setSelectedClassId(id);
    setIsModalOpen(true);
  };

  const renderRow = (item: Class) => (
    <tr key={item.id} className="border-b text-sm hover:bg-gray-400">
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="flex items-center gap-2 py-2">
        <Image
          src={item.photo}
          alt={item.trainerName}
          width={30}
          height={30}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{item.trainerName}</p>
          <p className="text-xs text-gray-500">{item.trainerEmail}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {new Date(item.startTime).toLocaleDateString("vi-VN")}
      </td>
      <td className="hidden md:table-cell">
        {new Date(item.endTime).toLocaleDateString("vi-VN")}
      </td>
      <td className="hidden lg:table-cell">{item.sessionDuration}</td>
      <td className="hidden lg:table-cell">{item.location}</td>
      <td className="hidden lg:table-cell">
        {item.currentStudents}/{item.maxStudents}
      </td>
      <td className="hidden lg:table-cell">{item.fee}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full  hover:bg-gray-500"
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
            <>
              <FormModal
                table="class"
                type="update"
                data={{
                  id: item.id,
                  Ten: item.className,
                  Phong: item.location,
                  MoTa: item.description,
                  TheLoai: item.type,
                  SoLuongMax: item.maxStudents,
                  Phi: parseFloat(item.fee.replace(/[^0-9.-]+/g, "")) || 0,
                  TrangThai: item.status,
                  ThoiLuong: parseInt(item.sessionDuration) || 0,
                  ThoiGianBatDau: new Date(item.startTime).toISOString().split("T")[0],
                  ThoiGianKetThuc: new Date(item.endTime).toISOString().split("T")[0],
                  idMaHLV: 1, 
                  lichlophoc: item.schedules.map((s) => ({
                    Thu: s.day,
                    GioBatDau: s.startTime,
                  })),
                }}
              />
              <FormModal table="classAD" type="delete" id={item.id} />
            </>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0 ">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold ">
          QUẢN LÝ LỚP HỌC
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center  rounded-full hover:bg-gray-500">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
              <FormModal table="class" type="create" />
          </div>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="text-center ">Đang tải...</div>
        ) : (
          <Table colums={columns} renderRow={renderRow} data={classes} />
        )}
      </div>

      <div>
        <Pagination />
      </div>

      {selectedClassId && (
        <ClassDetailModal
          classId={selectedClassId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClassManagement;