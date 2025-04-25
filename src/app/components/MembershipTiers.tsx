"use client"

import { useState } from "react";
import { memberShips } from "../lib/data";


const MembershipTiers = () => {
	const [memberShip,setMemberShip]= useState(memberShips)
  return (
	<div className='w-full flex justify-center items-center text-lg '>
		<table className="w-[80%]">
			<thead className="">
				<tr className="border-2">
					<th className="md:w-[70%] w-3/6 border-2"></th>
					<th className="md:w-[10%] w-1/6 border-2">FIRE</th>
					<th className="md:w-[10%] w-1/6 border-2">FIRE-PLUS</th>
					<th className="md:w-[10%] w-1/6 border-2">FIRE-VIP</th>
				</tr>
			</thead>
			<tbody>
				{memberShip.map((i)=>(
					<tr key={i.id} className="border-2">
						<td className="border-2 p-2">{i.title}</td>
						<td className={`border-2 ${i.tiers.includes("FIRE") ? "bg-gradient-to-r from-brown-red to-bright-orange" : "bg-none"}`}></td>
						<td className={`border-2 ${i.tiers.includes("FIRE-PLUS") ? "bg-gradient-to-r from-brown-red to-bright-orange":"bg-none"}`}></td>
						<td className={`border-2 ${i.tiers.includes("FIRE-VIP") ? "bg-gradient-to-r from-brown-red to-bright-orange":"bg-none"}`}></td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
  );
};

export default MembershipTiers;