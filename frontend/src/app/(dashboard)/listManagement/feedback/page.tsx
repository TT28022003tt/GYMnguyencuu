import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { feedbackData, role } from "@/app/lib/data";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

// Define the Feedback type
type Feedback = {
  id: number;
  idAccount: string;
  customerName: string;
  email?: string;
  phone: string;
  sentDate: string;
  rating: number;
  feedbackType: string; // 'Service' | 'ChatBoxAI'
  responder: string; // 'N/A' if not responded
  responseTime: string; // 'N/A' if not responded
  status: string; // 'Responded' | 'Not Responded'
  photo: string;
};

const columns = [
  { header: "Customer Name", accessor: "customerName" },
  { header: "Account ID", accessor: "idAccount" , className: "hidden md:table-cell"},
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Sent Date", accessor: "sentDate", className: "hidden md:table-cell" },
  { header: "Rating", accessor: "rating",className: "hidden md:table-cell" },
  { header: "Feedback Type", accessor: "feedbackType", className: "hidden lg:table-cell"},
  { header: "Responder", accessor: "responder",className: "hidden lg:table-cell" },
  { header: "Response Time", accessor: "responseTime", className: "hidden lg:table-cell" },
  { header: "Status", accessor: "status",className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const FeedbackManagement = () => {
  const renderRow = (item: Feedback) => (
    <tr key={item.id} className="border-b text-sm hover:bg-secondary">
      <td>
        <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.customerName}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.idAccount}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.sentDate}</td>
      <td className="hidden md:table-cell">{item.rating}</td>
      <td className="hidden md:table-cell">{item.feedbackType}</td>
      <td className="hidden md:table-cell">{item.responder}</td>
      <td className="hidden md:table-cell">{item.responseTime}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/feedback/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="feedback" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL FEEDBACK</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 text-white flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Table colums={columns} renderRow={renderRow} data={feedbackData} />
      </div>

      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default FeedbackManagement;
