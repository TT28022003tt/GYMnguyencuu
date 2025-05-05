"use client"

import { useEffect, useState } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faCirclePlus, faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Account = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  photo: string;
  role: string;
  status: string;
  address?: string;
  birthDate?: string;
  gender?: number;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    accessor: "Role",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "Status",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<Account[]>([]);
  const currentRole = "admin";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        const mappedUsers: Account[] = data.map((user: any) => ({
          id: user.idUser,
          fullName: user.Ten || "Unknown",
          phone: user.SoDienThoai || "N/A",
          email: user.Email || "N/A",
          photo: user.Anh || "/default-user.png",
          role: user.huanluyenvien?.length > 0 ? "Coach" : user.hocvien?.length > 0 ? "Student" : "User", // Derive role
          status: "Active", // Hardcoded for now, adjust based on your logic
          address: user.DiaChi,
          birthDate: user.NgaySinh ? new Date(user.NgaySinh).toLocaleDateString() : undefined,
          gender: user.GioiTinh,
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const renderRow = (item: Account) => (
    <tr key={item.id} className="border-b text-sm hover:bg-gray-400">
      <td>
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.fullName}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.role}</td>
      <td className="hidden lg:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/user/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {currentRole && <FormModal table="user" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL ACCOUNTS</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {currentRole && <FormModal table="user" type="create" />}
          </div>
        </div>
      </div>
      <div>
        <Table colums={columns} renderRow={renderRow} data={users} />
      </div>
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default UserManagement;