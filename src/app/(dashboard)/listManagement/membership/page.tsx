"use client";

import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faCirclePlus, faEye, faFilter, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

type Membership = {
  id: number; // idchitietgoitap
  cardId: number; // goitap.idMaGT
  accountId: string; // idchitietgoitap
  memberName: string; // user.Ten
  startDate: string; // NgayDangKy
  endDate: string; // NgayHetHan
  cardType: string; // goitap.Ten
  status: "Ongoing" | "Completed"; // TinhTrang
};

const columns = [
  { header: "Member Name", accessor: "memberName", className: "w-40" },
  { header: "ID Card", accessor: "cardId", className: "w-24" },
  { header: "Account ID", accessor: "accountId", className: "w-24" },
  { header: "Start Date", accessor: "startDate", className: "w-32 hidden lg:table-cell" },
  { header: "End Date", accessor: "endDate", className: "w-32 hidden lg:table-cell" },
  { header: "Card Type", accessor: "cardType", className: "w-28 hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "w-28 hidden md:table-cell" },
  { header: "Actions", accessor: "actions", className: "w-24" },
];

const MembershipManagement = () => {
  const role = "admin";
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch("/api/admin/membership");
        const data = await response.json();
        console.log("Fetched memberships:", data); // Debug
        // Sort by member name (A-Z)
        const sortedData = data.sort((a: Membership, b: Membership) =>
          a.memberName.localeCompare(b.memberName)
        );
        setMemberships(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memberships:", error);
        setLoading(false);
      }
    };

    fetchMemberships();
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
      <td className="p-2">{item.memberName}</td>
      <td className="p-2">{item.cardId}</td>
      <td className="p-2">{item.accountId}</td>
      <td className="p-2 hidden lg:table-cell">{item.startDate}</td>
      <td className="p-2 hidden lg:table-cell">{item.endDate}</td>
      <td className="p-2 hidden md:table-cell">{item.cardType}</td>
      <td className="p-2 hidden md:table-cell">
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
      <td className="p-2">
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/membership/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="membership" type="delete" id={item.id} />
          )}
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
            <Link href={`/products&services`} className="flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            </Link>
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
    </div>
  );
};

export default MembershipManagement;