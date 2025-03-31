"use client"
import React from 'react';
import { TagCloud } from 'react-tagcloud';

const WordCloud = () => {
	const data = [
		{ value: 'React', count: 100 },
		{ value: 'JavaScript', count: 90 },
		{ value: 'Node.js', count: 80 },
		{ value: 'Vue.js', count: 70 },
		{ value: 'Next.js', count: 60 },
		{ value: 'API', count: 50 },
		{ value: 'GraphQL', count: 40 },
		{ value: 'CSS', count: 30 },
		{ value: 'HTML', count: 20 },
		{ value: 'Web Development', count: 10 },
	  ];
	  const options = {
		rotations: 2,
		rotationAngles: [-45, 45],
		fontFamily: 'Arial',
		fontWeight: 'bold',
		color: 'random-dark',
		backgroundColor: '#333',
	  };
  return (
	<div className="cloud-container" style={{ backgroundColor: '', padding: '20px', borderRadius: '8px' }}>
      <h1 className="text-center text-white" style={{ marginBottom: '20px', fontSize: '24px' }}>CÁC TỪ KHÓA ĐƯỢC TÌM KIẾM NHIỀU TRÊN WEB</h1>
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={data}
        colorOptions={{ luminosity: 'light', hue: 'pastel' }} // Tông pastel nhẹ
      />
    </div>
  );
};

export default WordCloud;