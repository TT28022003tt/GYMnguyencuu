import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { nutritionData, role, trainerdata } from "@/app/lib/data";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type Nutrition = {
  id: number;
  customerName: string;
  trainerId: string;
  nutritionGoal: string; // Giảm cân, tăng cơ, duy trì sức khỏe,...
  caloricNeeds: number; // Tổng số calo cần thiết hàng ngày
  waterIntake: string; // Lượng nước khuyến nghị mỗi ngày (vd: "2.5L")
  startDate: string; // Ngày bắt đầu
  nutritionPlanName?: string; // Tên chế độ ăn, có thể để trống
  notes?: string[]; // Ghi chú về bệnh nền hoặc dị ứng
};


const columns = [
  { header: "NutritionId", accessor: "nutritionId" },
  { header: "Customer Name", accessor: "customerName", className: "hidden md:table-cell"},
  { header: "Trainer Name", accessor: "trainerName", className: "hidden md:table-cell" },
  { header: "Goal", accessor: "goal", className: "hidden md:table-cell" },
  { header: "Caloric Needs", accessor: "caloricNeeds", className: "hidden md:table-cell" },
  { header: "Water Intake", accessor: "waterIntake", className: "hidden lg:table-cell" },
  { header: "Start Date", accessor: "startDate", className: "hidden lg:table-cell" },
  { header: "Diet Plan", accessor: "dietPlan", className: "hidden lg:table-cell" },
  { header: "Note", accessor: "note", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const NutritionManagement = () => {
  const getTrainerNameById = (trainerId: string): string => {
    const trainer = trainerdata.find((t) => String(t.id) == trainerId);
    return trainer ? trainer.name : "Unknown Trainer";
  };
 
  const renderRow = (item:Nutrition) => (
    <tr key={item.id} className="border-b text-sm hover:bg-secondary">
      <td className="md:hidden xl:block">Nutrition {item.id}</td>
      <td className="hidden md:table-cell">{item.customerName}</td>
      <td className="hidden md:table-cell">{getTrainerNameById(item.trainerId)}</td>
      <td className="hidden md:table-cell">{item.nutritionGoal}</td>
      <td className="hidden md:table-cell">{item.caloricNeeds }</td>
      <td className="hidden md:table-cell">{item.waterIntake}</td>
      <td className="hidden md:table-cell">{item.startDate}</td>
      <td className="hidden md:table-cell">{item.nutritionPlanName || "N/A"}</td>
      <td className="hidden md:table-cell">{item.notes || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/listManagement/nutrition/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </Link>
          {role === "admin" && <FormModal table="nutrition" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">ALL NUTRITION</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 text-white flex items-center justify-center ">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            {role === "admin" && <FormModal table="nutrition" type="create" />}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Table colums={columns} renderRow={renderRow} data={nutritionData} />
      </div>
      <div className="">
        <Pagination />
      </div>
    </div>
  );
};

export default NutritionManagement;
