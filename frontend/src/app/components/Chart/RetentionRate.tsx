"use client"

import ReactECharts from 'echarts-for-react';

const RetentionRate = () => {
	const option = {
		backgroundColor: '', // Nền theo bg
		tooltip: {
		  trigger: 'axis',
		},
		xAxis: {
		  type: 'category',
		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
		  axisLabel: { color: '#fff' }, // Màu chữ trục X
		},
		yAxis: {
		  type: 'value',
		  axisLabel: { color: '#fff' }, // Màu chữ trục Y
		},
		series: [
		  {
			name: 'Retained',
			type: 'bar',
			data: [3000, 3200, 3500, 3700, 3900, 4200], // Số thành viên giữ lại
			itemStyle: { color: '#4CAF50' }, 
		  },
		  {
			name: 'Lost',
			type: 'bar',
			data: [500, 400, 300, 200, 100, 50], // Số thành viên mất
			itemStyle: { color: '#FF5733' }, 
		  },
		],
	};
	
  return (
	<div className=''>
		<p className="text-center">BIỂU ĐỒ TỶ LỆ GIỮ CHÂN THÀNH VIÊN</p>
		<ReactECharts option={option} style={{ height: '400px' }} />
	</div>
  );
};

export default RetentionRate;