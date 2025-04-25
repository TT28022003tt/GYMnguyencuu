"use client";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const UserVisits = () => {
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderWidth: 0,
      textStyle: { color: "#ddd" },
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      axisLabel: { color: "#ccc", fontSize: 12 },
      axisLine: { lineStyle: { color: "#555" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#ccc", fontSize: 12 },
      splitLine: { lineStyle: { color: "#222" } },
    },
    series: [
      {
        name: "Visits",
        type: "line",
        smooth: true, // Làm mượt đường cong
        data: [120, 200, 300, 250, 400],
        itemStyle: {
          color: "#4ADE80", // Màu đường
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(74, 222, 128, 0.5)" },
            { offset: 1, color: "rgba(74, 222, 128, 0)" },
          ]),
        },
        lineStyle: {
          width: 3,
          shadowColor: "rgba(74, 222, 128, 0.5)",
          shadowBlur: 10,
        },
        emphasis: {
          itemStyle: {
            color: "#FACC15", // Màu vàng khi hover
            borderColor: "#fff",
            borderWidth: 3,
          },
        },
        animationDelay: (idx: number) => idx * 100,
      },
    ],
    animationEasing: "elasticOut",
  };

  return (
    <div className=" rounded-xl shadow-2xl">
      <p className="text-center text-lg font-semibold tracking-wide">
        BIỂU ĐỒ LƯỢNG TRUY CẬP TRANG WEB
      </p>
      <ReactECharts option={option} style={{ height: "400px" }} />
    </div>
  );
};

export default UserVisits;
