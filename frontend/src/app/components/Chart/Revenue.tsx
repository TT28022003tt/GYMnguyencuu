"use client"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
	{
	  name: "Jan",
	  Revenue: 160,
	},
	{
	  name: "Feb",
	  Revenue: 260,
	},
	{
	  name: "Mar",
	  Revenue: 360,
	},
	{
	  name: "Apr",
	  Revenue: 560,
	},
	{
	  name: "May",
	  Revenue: 360,
	},
	{
	  name: "Jun",
	  Revenue: 260,
	},
	{
	  name: "Jul",
	  Revenue: 760,
	},
	{
	  name: "Aug",
	  Revenue: 860,
	},
	{
	  name: "Sep",
	  Revenue: 960,
	},
	{
	  name: "Oct",
	  Revenue: 660,
	},
	{
	  name: "Nov",
	  Revenue: 760,
	},
	{
	  name: "Dec",
	  Revenue: 460,
	},
  ];
  
const Revenue = () => {
  return (
	<div className=''>
		<p className="flex justify-center items-center">BIỂU ĐỒ DOANH THU</p>
		<ResponsiveContainer width="100%" height={400}>
			<LineChart data={data} 
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend  wrapperStyle={{
					fontSize:"20px"
				}}/>
				<Line type="monotone" dataKey="Revenue" stroke="#8884d8" />
			</LineChart>
		</ResponsiveContainer>
	</div>
  );
};

export default Revenue;