import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { workoutSchedulesData, role } from "@/app/lib/data";
import { faCirclePlus, faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type WorkoutSchedule = {
  id: number;
  scheduleId: string;
  customerName: string;
  trainerName: string;
  sessionProgress: string;
  startDate: string;
  status: string;
};

const columns = [
  { header: "Schedule ID", accessor: "scheduleId" },
  { header: "Customer Name", accessor: "customerName" },
  { header: "Trainer Name", accessor: "trainerName", className: "hidden md:table-cell" },
  { header: "Sessions", accessor: "sessionProgress", className: "hidden md:table-cell" },
  { header: "Start Date", accessor: "startDate", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const WorkoutScheduleManagement = () => {
  const renderRow = (item: WorkoutSchedule) => (
    <tr key={item.id} className="border-b text-sm hover:bg-secondary ">
      <td>{item.scheduleId}</td>
      <td>{item.customerName}</td>
      <td className="hidden md:table-cell">{item.trainerName}</td>
      <td className="hidden md:table-cell">{item.sessionProgress}</td>
      <td className="hidden md:table-cell">{item.startDate}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/workoutSchedule/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full ">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="workoutSchedule" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL WORKOUT SCHEDULES</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 text-white flex items-center justify-center ">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {role === "admin" && <FormModal table="workoutSchedule" type="create" />}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Table colums={columns} renderRow={renderRow} data={workoutSchedulesData} />
      </div>
      <div className="">
        <Pagination />
      </div>
    </div>
  );
};

export default WorkoutScheduleManagement;
