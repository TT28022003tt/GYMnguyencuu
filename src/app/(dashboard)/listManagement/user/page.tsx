"use client";

import { useEffect, useState } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import UserModal from "@/app/components/UserModal";

type Account = {
  id: number;
  TenDangNhap: string;
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
  { header: "Thông Tin", accessor: "info" },
  { header: "Số Điện Thoại", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Vai Trò", accessor: "Role", className: "hidden lg:table-cell" },
  { header: "Trạng Thái", accessor: "Status", className: "hidden lg:table-cell" },
  { header: "Hành Động", accessor: "action" },
];

const UserManagement = () => {
  const [users, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentRole = "admin";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      const mappedUsers: Account[] = data.map((user: any) => ({
        id: user.idUser,
        fullName: user.Ten || "Unknown",
        phone: user.SoDienThoai || "N/A",
        email: user.Email || "N/A",
        photo: user.Anh || "/images/default-avatar.png",
        role: user.taikhoan[0]?.VaiTro || (user.huanluyenvien?.length > 0 ? "trainer" : user.hocvien?.length > 0 ? "HocVien" : "admin"),
        status: user.taikhoan[0]?.VaiTro ? "Active" : "Inactive",
        address: user.DiaChi,
        birthDate: user.NgaySinh ? new Date(user.NgaySinh).toLocaleDateString("vi-VN") : "N/A",
        gender: user.GioiTinh,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchUsers();
    };
    window.addEventListener("refreshUserList", handleRefresh);
    return () => {
      window.removeEventListener("refreshUserList", handleRefresh);
    };
  }, []);

  const handleViewDetails = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const renderRow = (item: Account) => (
    <tr key={item.id} className="border-b text-sm hover:bg-gray-400">
      <td>
        <Image
          src={item.photo?.startsWith("/") || item.photo?.startsWith("http") ? item.photo : "/images/default-avatar.png"}
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
          <button
            onClick={() => handleViewDetails(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full"
          >
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
          {currentRole && (
            <FormModal
              table="user"
              type="update"
              data={{
                id: item.id,
                TenDangNhap: item.TenDangNhap,
                fullName: item.fullName,
                phone: item.phone,
                email: item.email,
                photo: item.photo,
                role: item.role,
                address: item.address,
                birthDate: item.birthDate,
                gender: item.gender,
              }}
            />
          )}
          <FormModal table="user" type="delete" id={item.id} onSuccess={fetchUsers}/>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ TÀI KHOẢN</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <FormModal table="user" type="create" />
          </div>
        </div>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <Table colums={columns} renderRow={renderRow} data={users} />
      )}
      <Pagination />
      {selectedUserId && (
        <UserModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;