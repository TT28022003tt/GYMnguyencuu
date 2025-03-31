"use client"
import ReactECharts from 'echarts-for-react';

const Membership = () => {
	const option = {
		backgroundColor: '',  // Nền theo nền gốc (đen)
		tooltip: {
		  trigger: 'item',
		  formatter: '{a} <br/>{b}: {c} ({d}%)', // Format thông tin khi hover
		},
		legend: {
		  orient: 'vertical',
		  left: 'left',
		  textStyle: {
			color: '#fff', // Màu chữ cho legend
		  },
		},
		series: [
		  {
			name: 'Membership',
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [
			  { value: 3200, name: 'FIRE' },
			  { value: 1500, name: 'FIRE-PLUS' },
			  { value: 800, name: 'FIRE-VIP' },
			],
			itemStyle: {
			  normal: {
				borderColor: '#fff',  // Đường viền sáng
				borderWidth: 2,
			  },
			},
			label: {
			  color: '#fff',  // Màu chữ nhãn
			},
			color: ['#FF5733', '#FFC300', '#1D71B8'], // Màu cho từng phần pie (FIRE, FIRE-PLUS, FIRE-VIP)
		  },
		],
	};
  return (
	<div className=''>
		<p className="text-center">BIỂU ĐỒ THÀNH VIÊN PHÒNG GYM</p>
		<ReactECharts option={option} style={{ height: '400px' }} />
	</div>
  );
};

export default Membership;