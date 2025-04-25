"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, AreaChart } from "recharts";

const data = [
  { name: "Jan", Revenue: 160 },
  { name: "Feb", Revenue: 260 },
  { name: "Mar", Revenue: 360 },
  { name: "Apr", Revenue: 560 },
  { name: "May", Revenue: 360 },
  { name: "Jun", Revenue: 260 },
  { name: "Jul", Revenue: 760 },
  { name: "Aug", Revenue: 860 },
  { name: "Sep", Revenue: 960 },
  { name: "Oct", Revenue: 660 },
  { name: "Nov", Revenue: 760 },
  { name: "Dec", Revenue: 460 },
];

const Revenue = () => {
  return (
    <div className=" ">
      <p className="text-center text-lg font-bold tracking-wide mb-4 ">
        BIỂU ĐỒ DOANH THU 
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          {/* Hiệu ứng Aurora Gradient */}
          <defs>
            <linearGradient id="auroraGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="50%" stopColor="#00DDFF" />
              <stop offset="100%" stopColor="#005FFF" />
            </linearGradient>
            {/* Lớp phủ phát sáng phía dưới */}
            <linearGradient id="auroraFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FFA3" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#00DDFF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#005FFF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="name" stroke="#ddd" tick={{ fontSize: 14 }} />
          <YAxis stroke="#ddd" tick={{ fontSize: 14 }} />
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#00FFA3", color: "#fff" }} />
          <Legend wrapperStyle={{ fontSize: "16px", color: "#fff" }} />

          {/* Đường Line Aurora */}
          <Line
            type="monotone"
            dataKey="Revenue"
            stroke="url(#auroraGradient)"
            strokeWidth={5}
            dot={false}
            activeDot={{ r: 8, fill: "#fff", stroke: "#00FFA3", strokeWidth: 3 }} // Bling effect
            filter="url(#glow)" // Hiệu ứng phát sáng
          />

          {/* Lớp phủ Aurora dưới biểu đồ */}
          <Area type="monotone" dataKey="Revenue" stroke="none" fill="url(#auroraFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Revenue;
