"use client"

import ReactECharts from 'echarts-for-react';

const AgeAndGender = () => {
	const option = {
		backgroundColor: '', 
		tooltip: {
		  trigger: 'axis',
		},
		xAxis: {
		  type: 'category',
		  data: ['18-25', '26-35', '36-45', '46-60', '60+'], // Các nhóm độ tuổi
		  axisLabel: { color: '#fff' }, // Màu chữ trục X
		},
		yAxis: {
		  type: 'value',
		  axisLabel: { color: '#fff' }, // Màu chữ trục Y
		},
		series: [
		  {
			name: 'Male',
			type: 'bar',
			data: [120, 180, 90, 50, 30], // Số nam trong mỗi nhóm độ tuổi
			itemStyle: {
			  color: '#A8D5BA', // Màu pastel cho nam
			},
		  },
		  {
			name: 'Female',
			type: 'bar',
			data: [100, 150, 120, 60, 40], // Số nữ trong mỗi nhóm độ tuổi
			itemStyle: {
			  color: '#F4A6C4', // Màu pastel cho nữ
			},
		  },
		],
	  };
	
  return (
	<div className=''>
		<p className="text-center">BIỂU ĐỒ TỶ LỆ GIỚI TÍNH VÀ ĐỘ TUỔI PHÒNG GYM</p>
		<ReactECharts option={option} style={{ height: '400px' }} />
	</div>
  );
};

export default AgeAndGender;