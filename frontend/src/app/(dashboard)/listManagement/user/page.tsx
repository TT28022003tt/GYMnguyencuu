import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { accountsData, role } from "@/app/lib/data";
import { faCirclePlus, faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Account = {
  id: number;
  accountId: string;
  userName: string;
  password: string;
  phone: string;
  role: string;
  status: string;
  email?: string;
  fullName: string;
  photo: string;
};

const columns = [
  {
    header: "Info", 
    accessor: "info",
  },
  {
    header: "Account ID",
    accessor: "Account Id",
    className: "hidden md:table-cell",
  },
  {
    header: "User Name",
    accessor: "Username",
    className: "hidden md:table-cell",
  },
  {
    header: "Pass Word",
    accessor: "PassWord",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
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
  const currentRole = "admin";

  const renderRow=(item:Account)=>(
    <tr key={item.id} className="border-b text-sm hover:bg-secondary ">
      <td>
        <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.fullName}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.accountId}</td>
      <td className="hidden md:table-cell">{item.userName}</td>
      <td className="hidden md:table-cell">{item.password}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.role}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/user/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full ">
          <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
          </Link>
          {currentRole && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full ">
            // <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5" />
            // </button>
            <>
              <FormModal table="user" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  )
  return (
    <div className="p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL ACCONUT</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 text-white flex items-center justify-center ">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5"/>
            </button>
            {currentRole && (
            //   <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
            //   <Image src="/image/plus.png" alt="" width={14} height={14}/>
            // </button>
            <FormModal table="user" type="create"/>
            )}
          </div>
        </div>
      </div>
      <div className="">
        <Table colums={columns} renderRow={renderRow} data={accountsData}/>
      </div>
      <div className="">
        <Pagination/>
      </div>
    </div>
  );
};

export default UserManagement;