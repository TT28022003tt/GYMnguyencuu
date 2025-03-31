import React from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';



const BodyTypeChart = () => {
	const data = [
		{ name: 'Vận động viên', size: 5000, width: 100, height: 50 },
		{ name: 'Chất béo cơ bắp', size: 2500, width: 50, height: 50 },
		{ name: 'Béo phì', size: 2500, width: 50, height: 50 },
		{ name: 'Cơ bắp', size: 5000, width: 100, height: 50 },
		{ name: 'Vừa vặn', size: 5000, width: 50, height: 100 },
		{ name: 'Thừa cân', size: 2500, width: 50, height: 50 },
		{ name: 'Cơ bắp thon gọn', size: 2500, width: 50, height: 50 },
		{ name: 'Mỏng1', size: 2500, width: 50, height: 50 },
		{ name: 'Marasmus', size: 2500, width: 50, height: 50 },
		{ name: 'Mỏng2', size: 5000, width: 100, height: 50 },
		{ name: 'Chất béo vô hình', size: 5000, width: 50, height: 100, color: '#76d7c4' },
	  ];
	  const CustomContent = ({ name, x, y, width, height, color }: any) => (
		<g>
		  <rect x={x} y={y} width={width} height={height} fill={color || '#ddd'} stroke="#fff" />
		  <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="" fontSize={12} dy=".35em">
			{name}
		  </text>
		</g>
	  );
	  
  return (
	<div className="">
		<h1 className=" font-medium text-xl py-4">Đánh Giá Kiểu Cơ Thể</h1>
		<ResponsiveContainer width="100%" height={400}>
  			<Treemap data={data} dataKey="size" aspectRatio={1} stroke="" content={<CustomContent />} />
		</ResponsiveContainer>
	</div>
  );
};

export default BodyTypeChart;
