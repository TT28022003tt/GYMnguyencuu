import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { eventData, role } from "@/app/lib/data";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Event = {
  id: number;
  eventId: string;
  eventName: string;
  startTime: string;
  endTime: string;
  location: string;
  participantGroup: string[]; // Bất kỳ ai, card FIRE, card FIRE-PLUS, card FIRE-VIP, ...
  photo: string;
};

const columns = [
  { header: "Event ID", accessor: "eventId" },
  { header: "Event Name", accessor: "eventName" },
  { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell"},
  { header: "End Time", accessor: "endTime",className: "hidden md:table-cell" },
  { header: "Location", accessor: "location", className: "hidden lg:table-cell" },
  { header: "Participants", accessor: "participantGroup", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const EventManagement = () => {
  const renderRow = (item: Event) => (
    <tr key={item.id} className="border-b text-sm hover:bg-secondary ">
      <td>{item.eventId}</td>
      <td>
        <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.eventName}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.startTime}</td>
      <td className="hidden md:table-cell">{item.endTime}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.participantGroup.join(", ")}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/event/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && <FormModal table="event" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL EVENTS</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 text-white flex items-center justify-center ">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Table colums={columns} renderRow={renderRow} data={eventData} />
      </div>
      <div className="">
        <Pagination />
      </div>
    </div>
  );
};

export default EventManagement;
