"use client"
import ReactECharts from 'echarts-for-react';

const ChatbotEngagement = () => {
	const option = {
		backgroundColor: '', 
		tooltip: {
		  trigger: 'item',
		},
		radar: {
		  indicator: [
			{ name: '1 Star', max: 100 },
			{ name: '2 Stars', max: 100 },
			{ name: '3 Stars', max: 100 },
			{ name: '4 Stars', max: 100 },
			{ name: '5 Stars', max: 100 },
		  ],
		  axisName: {
			color: '#fff',
		  },
		  splitArea: {
			areaStyle: {
			  color: ['#444', '#333', '#222', '#111', '#000'], // Màu nền chia các vùng radar
			},
		  },
		},
		series: [
		  {
			name: 'Satisfaction Level',
			type: 'radar',
			data: [
			  {
				value: [30, 50, 120, 80, 70], // Các mức độ sao cho mỗi người dùng
				itemStyle: {
				  color: '#FF1493', // Màu cho biểu đồ radar
				},
				areaStyle: {
				  color: 'rgba(255, 20, 147, 0.2)', // Màu nền trong suốt cho radar
				},
			  },
			],
		  },
		],
	};
  return (
	<div className=''>
		<p className="text-center">BIỂU ĐỒ THỂ HIỆN MỨC ĐỘ HÀI LÒNG CỦA NGƯỜI DÙNG VỚI CHATBOT</p>
		<ReactECharts option={option} style={{ height: '400px' }} />
	</div>
  );
};

export default ChatbotEngagement;