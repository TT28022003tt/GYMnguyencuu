import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { classData, role } from "@/app/lib/data";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";

// Define the Class type
type Class = {
  id: number;
  className: string;
  startTime: string;
  endTime: string;
  sessionDuration: string;
  location: string;
  trainerName: string;
  trainerEmail?: string;
  photo: string;
  currentStudents: number;
  maxStudents: number;
  fee: string;
};

const columns = [
  { header: "Class ID", accessor: "id", className: "hidden md:table-cell" },
  { header: "Class Name", accessor: "className", className: "hidden md:table-cell" },
  { header: "Trainer", accessor: "Trainer",},
  { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell" },
  { header: "End Time", accessor: "endTime", className: "hidden md:table-cell" },
  { header: "Session Duration", accessor: "sessionDuration", className: "hidden lg:table-cell" },
  { header: "Location", accessor: "location", className: "hidden lg:table-cell" },
  { header: "Student Count", accessor: "studentCount", className: "hidden lg:table-cell" },
  { header: "Fee", accessor: "fee", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ClassManagement = () => {
  const renderRow = (item: Class) => (
    <tr key={item.id} className="border-b text-sm hover:bg-secondary">
      <td className= "hidden md:table-cell">{item.id}</td>
      <td className= "hidden md:table-cell">{item.className}</td>
      <td className="flex items-center gap-2">
        <Image
          src={item.photo}
          alt=""
          width={30}
          height={30}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="">
          <p className="font-semibold">{item.trainerName}</p>
          <p className="text-xs text-gray-500">{item?.trainerEmail}</p>
        </div>
      </td>
      <td className= "hidden md:table-cell">{item.startTime}</td>
      <td className= "hidden md:table-cell">{item.endTime}</td>
      <td className= "hidden md:table-cell">{item.sessionDuration}</td>
      <td className= "hidden md:table-cell">{item.location}</td>
      <td className= "hidden md:table-cell">{item.currentStudents}/{item.maxStudents}</td>
      <td className= "hidden md:table-cell">{item.fee}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/Class/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && <FormModal table="class" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL CLASSES</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 text-white flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {role === "admin" && <FormModal table="class" type="create" />}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Table colums={columns} renderRow={renderRow} data={classData} />
      </div>

      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default ClassManagement;
