"Use client"
import ReactECharts from 'echarts-for-react';

const UserVisits = () => {
	const option = {
		xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
		yAxis: { type: 'value' },
		series: [{ data: [120, 200, 300, 250, 400], type: 'line' }],
	};
  return (
	<div className=''>
		<p className="text-center">BIỂU ĐỒ LƯỢNG TRUY CẬP TRANG WEB</p>
		<ReactECharts option={option} style={{ height: '400px' }}/>
	</div>
  );
};

export default UserVisits;