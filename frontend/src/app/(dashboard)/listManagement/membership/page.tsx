import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { membershipsData, role } from "@/app/lib/data";
import { faCirclePlus, faEye, faFilter, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Membership = {
  id: number;
  cardId: string;
  accountId: string;
  memberName: string;
  startDate: string;
  endDate: string;
  cardType: string;
  status: string;
  photo: string;
};

const columns = [
  { header: "Member Name", accessor: "memberName"},
  { header: "ID Card", accessor: "cardId" },
  { header: "Account ID", accessor: "accountId"},
  { header: "Start Date", accessor: "startDate", className: "hidden lg:table-cell" },
  { header: "End Date", accessor: "endDate", className: "hidden lg:table-cell" },
  { header: "Card Type", accessor: "cardType", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const Membership = () => {
  const renderRow = (item: Membership) => (
    <tr key={item.id} className="border-b text-sm hover:bg-secondary">
      <td>
        <Image src={item.photo} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <h3 className="font-semibold">{item.memberName}</h3>
      </td>
      <td>{item.cardId}</td>
      <td>{item.accountId}</td>
      <td className="hidden lg:table-cell">{item.startDate}</td>
      <td className="hidden lg:table-cell">{item.endDate}</td>
      <td className="hidden md:table-cell">{item.cardType}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
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
        <h1 className="hidden md:block text-lg font-semibold">MEMBERSHIP MANAGEMENT</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end text-white">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <Link href={`/products&services`} className="flex items-center justify-center" >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Table colums={columns} renderRow={renderRow} data={membershipsData} />
      </div>

      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default Membership;
