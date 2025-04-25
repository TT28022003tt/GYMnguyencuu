"use client";
import ReactECharts from "echarts-for-react";

const Membership = () => {
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#ccc",
        fontSize: 14,
      },
    },
    series: [
      {
        name: "Membership",
        type: "pie",
        radius: ["50%", "75%"],
        center: ["50%", "55%"],
        data: [
          { value: 3200, name: "FIRE" },
          { value: 1500, name: "FIRE-PLUS" },
          { value: 800, name: "FIRE-VIP" },
        ],
        itemStyle: {
          shadowBlur: 15,
          shadowColor: "rgba(255, 255, 255, 0.2)",
        },
        label: {
          color: "#eee",
          fontSize: 14,
          fontWeight: 500,
          formatter: "{b}\n{c} ({d}%)",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 30,
            shadowColor: "rgba(255, 255, 255, 0.4)",
          },
        },
        color: ["#FFB6C1", "#FFDAB9", "#B0E0E6"], 
      },
    ],
  };

  return (
    <div className=" rounded-xl shadow-lg">
      <p className="text-center text-lg font-medium ">
        BIỂU ĐỒ THÀNH VIÊN PHÒNG GYM
      </p>
      <ReactECharts option={option} style={{ height: "400px" }} />
    </div>
  );
};

export default Membership;
