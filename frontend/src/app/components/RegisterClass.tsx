"use client"

import { useState } from "react";
import { registerClasses } from "../lib/data";
import QuantitySelector from "./QuantitySelector";

const RegisterClass = () => {
	const [registerClass,setRegisterClass]=useState(registerClasses[0].FIRE)
	const [months, setMonths] = useState(1);
	const [totalCost, setTotalCost] = useState(registerClass.costday * 30 * months);

    const handleClick = (classType: 'FIRE' | 'FIREPLUS' | 'FIREVIP') => {
		const selectedClass = registerClasses[0][classType];
		setRegisterClass(selectedClass); // Cập nhật loại dịch vụ
		setTotalCost(selectedClass.costday * 30 * months); // Tính lại tổng tiền dựa trên số tháng hiện tại
	};
	
	const handleMonthsChange = (newMonths: number) => {
		setMonths(newMonths); 
		setTotalCost(registerClass.costday * 30 * newMonths); // Tính lại tổng tiền
	};
	

  return (
	<div className='h-[250px] text-xl flex mt-10 bg-gradient-to-r from-brown-red to-bright-orange'>
		<div className="w-[30%] h-full flex justify-center items-center border-r ">
			<div className="flex flex-col justify-center items-start gap-5">
			    <button onClick={()=>handleClick("FIRE")}>FIRE</button>
			    <button onClick={()=>handleClick("FIREPLUS")}>FIREPLUS</button>
			    <button onClick={()=>handleClick("FIREVIP")}>FIREVIP</button>
			</div>
		</div>
		<div className="w-[40%] h-full flex flex-col justify-center ml-[5%]">
		    <div className="flex justify-start items-center gap-2">
			    <h3>Số tháng:</h3>
		        <div className="">
					<QuantitySelector defaultValue={1} onValueChange={handleMonthsChange} />
				</div>
			</div>
		    <div className="">
				<p className="mt-4">Giá 1 ngày: {registerClass.costday.toLocaleString()} VND</p>
				<p className="mt-4">Giá 1 tháng: {(registerClass.costday * 30).toLocaleString()} VND</p>
			</div>
	        <div className="flex justify-start items-center mt-4">
			    <h3>Tổng chi phí :</h3>
                <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{totalCost.toLocaleString()} VND</p>
			</div>
		</div>
		<div className="w-[30%]  flex justify-start items-center">
			<button className="bg-dark-red p-2 rounded-2xl">ĐĂNG KÝ NGAY</button>
		</div>
	</div>
  );
};

export default RegisterClass;