"use client"

import { useState } from "react";
import { productsdata } from "../lib/data";
import Link from "next/link";
import Image from "next/image";

const Products = () => {
	const [goods, setGoods] = useState(productsdata)
  return (
	<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 ml-12 mr-12 p-4'>
		{goods.map((i)=>(
			<Link 
				href={i.href}
				key={i.id}
				className="bg-white text-black flex flex-col items-center justify-center text-center lg:justify-start "
			>
				<Image src={i.imageUrl} alt="" width={200} height={200} className="mb-4 w-full h-[85%]"/>
				<p className="text-lg">{i.label}</p>
				<p>{i.price}VNĐ</p>
			</Link>
		))}
	</div>
  );
};

export default Products;