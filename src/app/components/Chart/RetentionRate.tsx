"use client";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts"; // ✅ Import đúng cách

const RetentionRate = () => {
  const option = {
    backgroundColor: "transparent", // Nền trong suốt
    tooltip: {
      trigger: "axis",
      textStyle: { color: "#ddd" },
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Tooltip nền tối mờ
      borderWidth: 0,
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisLabel: { color: "#aaa", fontSize: 12 },
      axisLine: { lineStyle: { color: "#444" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#aaa", fontSize: 12 },
      splitLine: { lineStyle: { color: "#222" } },
    },
    legend: {
      textStyle: { color: "#ddd", fontSize: 14 },
      icon: "roundRect",
    },
    series: [
      {
        name: "Retained",
        type: "bar",
        data: [3000, 3200, 3500, 3700, 3900, 4200],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#6CBF84" },
            { offset: 1, color: "#3B7D5E" },
          ]),
          barBorderRadius: [6, 6, 0, 0],
        },
        emphasis: {
          itemStyle: { color: "#91E0A9" },
        },
      },
      {
        name: "Lost",
        type: "bar",
        data: [500, 400, 300, 200, 100, 50],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#F58A7A" },
            { offset: 1, color: "#C7625A" },
          ]),
          barBorderRadius: [6, 6, 0, 0],
        },
        emphasis: {
          itemStyle: { color: "#FFAC9A" },
        },
      },
    ],
  };

  return (
    <div className=" rounded-xl shadow-2xl">
      <p className="text-center text-lg font-semibold  tracking-wide">
        BIỂU ĐỒ TỶ LỆ GIỮ CHÂN THÀNH VIÊN
      </p>
      <ReactECharts option={option} style={{ height: "420px" }} />
    </div>
  );
};

export default RetentionRate;
