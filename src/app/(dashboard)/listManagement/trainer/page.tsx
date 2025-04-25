import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { hlvData } from "@/app/lib/data";
import { faEye, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Trainer = {
	id: number;
	idMaHLV: string;
	ten: string;
	ngaySinh: string;
	gioiTinh: string;
	chungChi: string;
	bangCap: string;
	chuyenMon: string;
	email: string;
	luong: number;
	photo: string;
};

const columns = [
	{ header: "Name", accessor: "ten" },
	{ header: "ID", accessor: "idTrainer" },
	{ header: "Date of Birth", accessor: "ngaySinh", className: "hidden md:table-cell" },
	{ header: "Gender", accessor: "gioiTinh", className: "hidden md:table-cell" },
	{ header: "Certification", accessor: "chungChi", className: "hidden lg:table-cell" },
	{ header: "Degree", accessor: "bangCap", className: "hidden lg:table-cell" },
	{ header: "Expertise", accessor: "chuyenMon", className: "hidden lg:table-cell" },
	{ header: "Salary", accessor: "luong", className: "hidden md:table-cell" },
	{ header: "Actions", accessor: "action" },
];

const Trainer = () => {
	const currentRole = "admin";
	const renderRow = (item: Trainer) => (
		<tr key={item.id} className="border-b text-sm hover:bg-gray-400">
			<td>
				<Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
				<div className="flex flex-col">
					<h3 className="font-semibold">{item.ten}</h3>
					<p className="text-xs text-gray-500">{item?.email}</p>
				</div>
			</td>
			<td className="hidden md:table-cell">{item.idMaHLV}</td>
			<td className="hidden md:table-cell">{item.ngaySinh}</td>
			<td className="hidden md:table-cell">{item.gioiTinh}</td>
			<td className="hidden lg:table-cell">{item.chungChi}</td>
			<td className="hidden lg:table-cell">{item.bangCap}</td>
			<td className="hidden lg:table-cell">{item.chuyenMon}</td>
			<td className="hidden md:table-cell">{item.luong}</td>
			<td>
				<div className="flex items-center gap-2">
					<Link href={`/hlvManagement/view/${item.idMaHLV}`}>
						<button className="w-7 h-7 flex items-center justify-center rounded-full">
							<FontAwesomeIcon icon={faEye} className="w-5 h-5" />
						</button>
					</Link>
					<FormModal table="trainer" type="delete" id={item.id} />
				</div>
			</td>
		</tr>
	);

	return (
		<div className="p-4 rounded-md flex-1 m-4 mt-0">
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ HUẤN LUYỆN VIÊN</h1>
				<div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						<button className="w-8 h-8  flex items-center justify-center ">
							<FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
						</button>
						{currentRole && (
							//   <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							//   <Image src="/image/plus.png" alt="" width={14} height={14}/>
							// </button>
							<FormModal table="user" type="create" />
						)}
					</div>
				</div>
			</div>
			<Table colums={columns} renderRow={renderRow} data={hlvData} />
			<Pagination />
		</div>
	);
};

export default Trainer;
