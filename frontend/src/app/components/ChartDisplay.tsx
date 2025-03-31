"use client";

import { useState } from "react";
import TotalCard from "./TotalCard";
import Revenue from "./Chart/Revenue";
import UserVisits from "./Chart/UserVisits";
import Membership from "./Chart/Membership";
import RetentionRate from "./Chart/RetentionRate";
import ChatbotEngagement from "./Chart/ChatbotEngagement";
import AgeAndGender from "./Chart/AgeAndGender";
import WordCloud from "./Chart/WordCloud";

const ChartDisplay = () => {
  const [selectedType, setSelectedType] = useState<string>("Total User Visits");

  const renderChart = () => {
    switch (selectedType) {
      case "Total User Visits":
        return <UserVisits/>
      case "Total Revenue":
        return <Revenue/>
      case "Total Membership":
        return <Membership/>
      case "Total Retention Rate":
        return <RetentionRate/>
      case "Total Chatbot Engagement":
        return <ChatbotEngagement/>
      case "Total Age & Gender":
        return <AgeAndGender/>
      default:
        return <div className="chart">Chọn một loại để xem biểu đồ</div>;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
        <TotalCard type="Total User Visits" onSelect={setSelectedType} />
        <TotalCard type="Total Revenue" onSelect={setSelectedType} />
        <TotalCard type="Total Membership" onSelect={setSelectedType} />
        <TotalCard type="Total Retention Rate" onSelect={setSelectedType} />
        <TotalCard type="Total Chatbot Engagement" onSelect={setSelectedType} />
        <TotalCard type="Total Age & Gender" onSelect={setSelectedType} />
      </div>

      <div className="mt-8">{renderChart()}</div>
    </div>
  );
};

export default ChartDisplay;
