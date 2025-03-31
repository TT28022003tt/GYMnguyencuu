"use client"

import Image from "next/image";
import QuantitySelector from "./QuantitySelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { cartItems } from "../lib/data";

const CartInfo = () => {
	const [cartItem,setCartItems]= useState(cartItems)
  return (
	<div className='flex'>
		<input type="checkbox" />
		<div className="flex">
			<Image src="/images/products/bcaa-powder.jpg" alt="" width={20} height={20}/>
			<p>bcaa</p>
		</div>
		<select>
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>
		<p>99.999đ</p> 
		{/* <QuantitySelector defaultValue={1} onValueChange={null}/> */}
		<p>99.999đ</p>
		<FontAwesomeIcon icon={faTrash} width={20} height={20}/>
	</div>
  );
};

export default CartInfo;