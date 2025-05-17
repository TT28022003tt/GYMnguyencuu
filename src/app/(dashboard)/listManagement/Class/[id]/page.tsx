"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ClassDetailModal from "@/app/components/ClassDetailModal";

const ClassDetailPage = () => {
  const { id } = useParams();
  const classId = parseInt(id as string);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen">
      <ClassDetailModal classId={classId} isOpen={true} onClose={() => {}} />
    </div>
  );
};

export default ClassDetailPage;