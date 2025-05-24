"use client";

import FormModal from "@/app/components/FormModal";
import MembershipDetailModal from "@/app/components/MembershipDetailModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faCirclePlus, faEye, faFilter, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Membership = {
  id: number;
  cardId: number;
  userId: number;
  idMaHLV: number;
  memberName: string;
  email: string;
  photo: string;
  startDate: string;
  endDate: string;
  cardType: string;
  SoThang: number;
  TongTien: number;
  status: "Ongoing" | "Completed";
};

const columns = [
  { header: "Tên Thành Viên", accessor: "memberName", className: "w-40" },
  { header: "ID thẻ", accessor: "cardId", className: "w-24" },
  { header: "ID Người Dùng", accessor: "accountId", className: "w-24" },
  { header: "Ngày Bắt Đầu", accessor: "startDate", className: "w-32 hidden lg:table-cell" },
  { header: "Ngày Kết Thúc", accessor: "endDate", className: "w-32 hidden lg:table-cell" },
  { header: "Loại Thẻ", accessor: "cardType", className: "w-28 hidden md:table-cell" },
  { header: "Trạng Thái", accessor: "status", className: "w-28 hidden md:table-cell" },
  { header: "Hành Động", accessor: "actions", className: "w-24" },
];

const MembershipManagement = () => {
  const role = "admin";
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };
  const fetchMemberships = async () => {
    try {
      const response = await fetch("/api/admin/membership");
      const data = await response.json();
      console.log("Fetched memberships:", data);
      const sortedData = data.sort((a: Membership, b: Membership) =>
        a.memberName.localeCompare(b.memberName)
      );
      setMemberships(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMemberships();
  }, []);


  useEffect(() => {
    const handleRefresh = () => {
      fetchMemberships();
    };
    window.addEventListener('refreshMemberships', handleRefresh);
    return () => {
      window.removeEventListener('refreshMemberships', handleRefresh);
    };
  }, []);

  const handleStatusChange = async (membershipId: number, newStatus: "Ongoing" | "Completed") => {
    try {
      const response = await fetch(`/api/admin/membership`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      setMemberships((prev) =>
        prev.map((membership) =>
          membership.id === membershipId ? { ...membership, status: newStatus } : membership
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderRow = (item: Membership) => (
    <tr key={item.id} className="border-b text-sm hover:bg-gray-400">
      <td className=" flex items-center gap-3">
        <Image
          src={item.photo}
          alt={item.memberName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover hidden md:block"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.memberName}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="">{item.cardId}</td>
      <td className="">{item.userId}</td>
      <td className=" hidden lg:table-cell">{item.startDate}</td>
      <td className=" hidden lg:table-cell">{item.endDate}</td>
      <td className=" hidden md:table-cell">{item.cardType}</td>
      <td className=" hidden md:table-cell">
        <select
          value={item.status}
          onChange={(e) =>
            handleStatusChange(item.id, e.target.value as "Ongoing" | "Completed")
          }
          className="border rounded p-1 w-full"
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </td>
      <td className="">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(item.userId)}
            className="w-7 h-7 flex items-center justify-center rounded-full"
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
          <FormModal
            table="membership"
            type="update"
            data={{
              id: item.id,
              idUser: item.userId,
              idMaGT: item.cardId,
              idMaHLV: item.idMaHLV,
              SoThang: item.SoThang,
              TongTien: item.TongTien,
              NgayDangKy: item.startDate,
              NgayHetHan: item.endDate,
              TinhTrang: item.status === "Ongoing" ? 1 : 0,
            }}
          />
          <FormModal table="membership" type="delete" id={item.id} onSuccess={fetchMemberships} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ GÓI TẬP</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <FormModal table="membership" type="create" />
          </div>
        </div>
      </div>
      <div className="flex-1">
        {loading ? (
          <p>Loading...</p>
        ) : memberships.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-xl">Không có ai đăng ký gói tập.</p>
        ) : (
          <Table colums={columns} renderRow={renderRow} data={memberships} />
        )}
      </div>
      <div>
        <Pagination />
      </div>
      {selectedUserId && (
        <MembershipDetailModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MembershipManagement;