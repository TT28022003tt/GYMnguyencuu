import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WeightControldata } from "../lib/data";

type WeightControl = {
	id: number;
	idAccount: number;
	weight: number;
	targetWeight: number;
	weightControl: number;
	fatControl: number;
	muscleControl: number;
};

// Kiểm Soát Cân Nặng
const WeightControlAnalysis = () => {
	const { id } = useParams(); // Lấy id từ URL
	const [bodyComposition, setBodyComposition] = useState<WeightControl | null>(null);

	useEffect(() => {
		if (id) {
			const selectedData = WeightControldata.find((item) => item.idAccount == Number(id));
			setBodyComposition(selectedData || null);
		}
	}, [id]);

	if (!bodyComposition) return <p>Đang tải dữ liệu...</p>;

	return (
		<div className='w-full mt-4 bg-secondary rounded-md p-4'>
			<h1 className="py-2 text-xl font-medium">Kiểm Soát Cân Nặng</h1>
			<div className="flex items-center  border-b border-white pb-2">
				<p>Trọng lượng mục tiêu đề nghị: {bodyComposition.weightControl} kg</p>
			</div>
			<div>
				<table className="border-separate border-spacing-y-3 text-white w-full">
					<tbody className="">
						<tr className="text-center ">
							<td className="text-left">Kiểm Soát Cân Nặng</td>
							<td className="">{bodyComposition.weightControl} kg</td>
							<td>{((bodyComposition.weightControl / bodyComposition.weight) * 100).toFixed(2)}%</td>
						</tr>
						<tr className="text-center">
							<td className="text-left">Kiểm Soát Chất Béo</td>
							<td>{bodyComposition.fatControl} kg</td>
							<td>{((bodyComposition.fatControl / bodyComposition.weight) * 100).toFixed(2)}%</td>
						</tr>
						<tr className="text-center">
							<td className="text-left">Kiểm Soát Cơ</td>
							<td>{bodyComposition.muscleControl} kg</td>
							<td>{((bodyComposition.muscleControl / bodyComposition.weight) * 100).toFixed(2)}%</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default WeightControlAnalysis;
