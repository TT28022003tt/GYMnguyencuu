"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { bodyCompositionData } from "../lib/data";

type BodyComposition = {
	id: number;
	idAccount: number;
	weight: number;
	bodyFatPercentage: number;
	minerals: number;
	protein: number;
	bodyWater: number;
	muscleMass: number;
	skeletalMuscle: number;
	bodyFatMass: number;
  };
  


//Phân Tích Thành Phần cơ thể
const BodyCompositionAnalysis = () => {
	const { id } = useParams(); // Lấy id từ URL
	const [bodyComposition, setBodyComposition] = useState<BodyComposition | null>(null);
	
	useEffect(() => {
		if (id) {
		  const selectedData = bodyCompositionData.find((item) => item.idAccount == Number(id));
		  setBodyComposition(selectedData || null);
		}
	}, [id]);
	if (!bodyComposition) return <p>Đang tải dữ liệu...</p>;
	  
  return (
	<div className='w-full mt-4  bg-secondary rounded-md p-4 '>
		<h1 className="py-2 text-xl font-medium ">Phân Tích Thành Phần Cơ Thể</h1>
		<div className="flex items-center justify-between border-b border-white pb-2 ">
			<p className="">Tuổi:29</p>
			<p className="">Chiều Cao:160cm</p>
			<p className="">Cân Nặng:{bodyComposition.weight}kg</p>
		</div>
		<div className="">
			<table className="border-separate border-spacing-y-3 text-white w-full table-fixed">
				<thead>
					<tr className="w-full text-center ">
						<td className="w-1/4"></td>
						<td className="w-1/4">Đo Lường(kg)</td>
						<td className="w-1/4">Tỷ Lệ Trọng Lượng(%)</td>
						<td className="w-1/4">Đánh Giá</td>
					</tr>
				</thead>
				<tbody className="text-center">
					<tr className="text-center ">
						<td className="text-left">Cân Nặng</td>
						<td>{bodyComposition.weight} kg</td>
						<td>100%</td>
						<td>Tiêu chuẩn</td>
					</tr>
					<tr className="text-center">
						<td className="text-left">Mỡ Cơ Thể</td>
						<td>{bodyComposition.bodyFatMass} kg</td>
						<td>{bodyComposition.bodyFatPercentage}%</td>
						<td>Tiêu chuẩn</td>
					</tr>
					<tr className="text-center ">
						<td className="text-left">Muối Vô cơ</td>
						<td>{bodyComposition.minerals}</td>
						<td>{((bodyComposition.minerals / bodyComposition.weight) * 100).toFixed(2)}%</td>
						<td>Tiêu chuẩn</td>
					</tr>
					<tr className="text-center ">
						<td className="text-left">Protein</td>
						<td>{bodyComposition.protein}</td>
						<td>{((bodyComposition.protein / bodyComposition.weight) * 100).toFixed(2)}%</td>
						<td>Tiêu chuẩn</td>
					</tr>
					<tr className="text-center ">
						<td className="text-left">Nước Trong Cơ Thể</td>
						<td>{bodyComposition.bodyWater}</td>
						<td>{((bodyComposition.bodyWater / bodyComposition.weight) * 100).toFixed(2)}%</td>
						<td>Tiêu chuẩn</td>
					</tr>
					<tr className="text-center ">
						<td className="text-left">Cơ Bắp</td>
						<td>{bodyComposition.muscleMass}</td>
						<td>{((bodyComposition.muscleMass / bodyComposition.weight) * 100).toFixed(2)}%</td>
						<td>Tiêu chuẩn</td>
					</tr>
					<tr className="text-center ">
						<td className="text-left">Cơ Xương</td>
						<td>{bodyComposition.skeletalMuscle}</td>
						<td>{((bodyComposition.skeletalMuscle / bodyComposition.weight) * 100).toFixed(2)}%</td>
						<td>Tiêu chuẩn</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
  );
};

export default BodyCompositionAnalysis;