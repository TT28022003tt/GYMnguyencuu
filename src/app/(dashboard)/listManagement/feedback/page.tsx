"use client";

import FeedbackDetailModal from "@/app/components/FeedbackDetailModal";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Feedback = {
  idMaPH: number;
  customerName: string;
  email: string | null;
  phone: string | null;
  sentDate: string;
  rating: number | null;
  feedbackType: string | null;
  content: string | null;
  photo: string | null;
};

const columns = [
  { header: "Customer Name", accessor: "customerName" },
  { header: "Email", accessor: "email", className: "hidden md:table-cell" },
  { header: "Phone Number", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Sent Date", accessor: "sentDate", className: "hidden md:table-cell" },
  { header: "Rating", accessor: "rating", className: "hidden md:table-cell" },
  { header: "Feedback Type", accessor: "feedbackType", className: "hidden lg:table-cell" },
  { header: "Content", accessor: "content", className: "hidden lg:table-cell" },
  { header: "Action", accessor: "action" },
];


const FeedbackManagement = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true); 
      setError(null);
      try {
        const res = await fetch("/api/admin/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data = await res.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Không thể tải phản hồi.");
      } finally {
        setLoading(false); 
      }
    };

    fetchFeedback();
  }, []);


  const renderRow = (item: Feedback) => (
    <tr key={item.idMaPH} className="border-b text-sm hover:bg-gray-100">
      <td className="py-2">
        <div className="flex items-center">
          <Image
            src={item.photo || "/images/default-avatar.png"}
            alt={item.customerName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover mr-2"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.customerName}</h3>
            <p className="text-xs text-gray-500">{item.email || "N/A"}</p>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.email || "N/A"}</td>
      <td className="hidden md:table-cell">{item.phone || "N/A"}</td>
      <td className="hidden md:table-cell">
        {item.sentDate ? new Date(item.sentDate).toLocaleDateString("vi-VN") : "N/A"}
      </td>
      <td className="hidden md:table-cell">{item.rating ?? "N/A"}</td>
      <td className="hidden lg:table-cell">{item.feedbackType || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          {/* <Link href={`/listManagement/feedback/${item.idMaPH}`}> */}
          <button
            onClick={() => setSelectedFeedback(item)}
            className="w-7 h-7 flex items-center justify-center rounded-full ">
            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
          </button>
          {/* </Link> */}
          <FormModal table="feedback" type="delete" id={item.idMaPH} />
        </div>
      </td>
    </tr>
  );
  return (
    <div className="p-4 rounded-md flex flex-col min-h-screen m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">QUẢN LÝ FEEDBACK</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải phản hồi...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : feedbackData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Không có phản hồi nào.</div>
        ) : (
          <Table colums={columns} renderRow={renderRow} data={feedbackData} />
        )}
      </div>


      <div>
        <Pagination />
      </div>
      {selectedFeedback && (
        <FeedbackDetailModal feedback={selectedFeedback} onClose={() => setSelectedFeedback(null)} />
      )}
    </div>
  );
};

export default FeedbackManagement;