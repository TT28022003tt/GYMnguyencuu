"use client"

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { trainerdata } from '../lib/data';
import { useParams } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type TrainerData = {
  id: number;
  idAccount: number;
  name: string;
  averageRating: number;
};

const Performance = ({ role }: { role: string }) => {
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const [data, setData] = useState<TrainerData | null>(null);

  useEffect(() => {
    if (id) {
      const selectedData = trainerdata.find((item) => item.idAccount === Number(id));
      setData(selectedData || null);
    }
  }, [id]);

  if (!data) return <p>Đang tải dữ liệu...</p>;

  const handleRating = (value: number) => setRating(value);

  const renderStars = () => (
    <div className="flex justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`w-8 h-8 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
          onClick={() => handleRating(star)}
        />
      ))}
    </div>
  );

  const renderTrainerAverage = () => {
    const chartData = [
      { name: 'Rating', value: data.averageRating, fill: '#4CAF50' },
      { name: 'Remaining', value: 5 - data.averageRating, fill: '#ddd' }
    ];

    return (
      <div className="text-center">
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} startAngle={180} endAngle={0} />
            </PieChart>
          </ResponsiveContainer>
        <div className="mt-[-100px]">
          <h2 className="text-3xl font-bold">{data.averageRating}</h2>
          <p className="text-sm text-gray-400">Trung bình đánh giá</p>
        </div>
      </div>
    );
  };

  const renderAdminView = () => (
    <div>
      {trainerdata.map((trainer) => (
        <div key={trainer.id} className="flex justify-between bg-secondary p-2 rounded-md mb-2">
          <span>{trainer.name}</span>
          <span>{trainer.averageRating} / 5</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className='bg-secondary p-4 rounded-md'>
      {role === 'customer' && renderStars()}
      {role === 'trainer' && renderTrainerAverage()}
      {role === 'admin' && renderAdminView()}
    </div>
  );
};

export default Performance;
