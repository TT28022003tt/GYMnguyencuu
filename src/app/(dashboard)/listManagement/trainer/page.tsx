"use client";

import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import TrainerModal from "@/app/components/TrainerModal";
import { faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Trainer = {
  id: number;
  idMaHLV: number;
  ten: string;
  ngaySinh: string;
  gioiTinh: number;
  diaChi:string;
  soDienThoai:string;
  chungChi: string | null;
  bangCap: string | null;
  chuyenMon: string | null;
  email: string;
  luong: number | null;
  photo: string;
};

const columns = [
  { header: "Name", accessor: "ten" },
  { header: "ID", accessor: "idMaHLV" },
  { header: "Date of Birth", accessor: "ngaySinh", className: "hidden md:table-cell" },
  { header: "Gender", accessor: "gioiTinh", className: "hidden md:table-cell" },
  { header: "Certification", accessor: "chungChi", className: "hidden lg:table-cell" },
  { header: "Degree", accessor: "bangCap", className: "hidden lg:table-cell" },
  { header: "Expertise", accessor: "chuyenMon", className: "hidden lg:table-cell" },
  { header: "Salary", accessor: "luong", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const Trainer = () => {
  const currentRole = "admin";
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch("/api/admin/trainer");
        const data = await response.json();
        setTrainers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleViewDetails = (id: number) => {
    setSelectedTrainerId(id);
    setIsModalOpen(true);
  };

  const renderRow = (item: Trainer) => (
    <tr key={item.id} className="border-b text-sm hover:bg-gray-400">
      <td>
        <Image
          src={item.photo?.startsWith("/") ? item.photo : "/images/default-avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.ten}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.idMaHLV}</td>
      <td className="hidden md:table-cell">{item.ngaySinh}</td>
      <td className="hidden md:table-cell">{item.gioiTinh === 1 ? "Nam" : "Nữ"}</td>
      <td className="hidden lg:table-cell">{item.chungChi || "N/A"}</td>
      <td className="hidden lg:table-cell">{item.bangCap || "N/A"}</td>
      <td className="hidden lg:table-cell">{item.chuyenMon || "N/A"}</td>
      <td className="hidden md:table-cell">{item.luong?.toFixed(2) || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(item.idMaHLV)}
            className="w-7 h-7 flex items-center justify-center rounded-full"
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
          <FormModal
            table="trainer"
            type="update"
            data={{
              id: item.id,
              idMaHLV: item.idMaHLV,
              ten: item.ten,
              ngaySinh: item.ngaySinh,
              gioiTinh: item.gioiTinh,
              diaChi: item.diaChi,
              soDienThoai: item.soDienThoai,
              chungChi: item.chungChi,
              bangCap: item.bangCap,
              chuyenMon: item.chuyenMon,
              email: item.email,
              luong: item.luong,
              photo: item.photo,
            }}
          />
          <FormModal table="trainer" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ HUẤN LUYỆN VIÊN</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {currentRole && <FormModal table="trainer" type="create" />}
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table colums={columns} renderRow={renderRow} data={trainers} />
      )}
      <Pagination />
      {selectedTrainerId && (
        <TrainerModal
          trainerId={selectedTrainerId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Trainer;