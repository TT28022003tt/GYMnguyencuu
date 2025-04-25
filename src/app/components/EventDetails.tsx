"use client";

import React, { useEffect, useRef, useState } from "react";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "@/contexts/useContext";
import { toast } from "react-toastify";

interface EventDetailsProps {
  selectedId: string | null;
  events: any[];
  onFormSuccess: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ selectedId, events, onFormSuccess }) => {
  const { user } = useMyContext();
  const [activeId, setActiveId] = useState<string | null>(selectedId);
  const [eventsByDay, setEventsByDay] = useState<{ [key: string]: any[] }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>(events);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Đồng bộ events từ props và lọc khi searchQuery thay đổi
  useEffect(() => {
    if (!searchQuery) {
      setFilteredEvents(events);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = events.filter((event) => {
        return (
          event.title.toLowerCase().includes(lowerQuery) ||
          event.extendedProps.student.toLowerCase().includes(lowerQuery) ||
          event.extendedProps.trainer.toLowerCase().includes(lowerQuery) ||
          event.extendedProps.exercises.some(
            (ex: any) =>
              ex.name.toLowerCase().includes(lowerQuery) ||
              ex.muscleGroup.toLowerCase().includes(lowerQuery) ||
              ex.description.toLowerCase().includes(lowerQuery)
          )
        );
      });
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  // Xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Nhóm sự kiện theo ngày
  useEffect(() => {
    if (filteredEvents.length === 0) {
      setActiveId(null);
    } else if (selectedId && selectedId !== activeId) {
      setActiveId(selectedId);
    }

    const getEventsByDay = (events: any[]) => {
      const dayOfWeek = ["CHỦ NHẬT", "THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7"];
      const eventsByDay: { [key: string]: any[] } = {};
      dayOfWeek.forEach((day) => {
        eventsByDay[day] = [];
      });

      events.forEach((event) => {
        const eventDate = new Date(event.start);
        const day = dayOfWeek[eventDate.getDay()];
        eventsByDay[day].push(event);
      });

      return eventsByDay;
    };

    const eventsByDayData = getEventsByDay(filteredEvents);
    setEventsByDay(eventsByDayData);
  }, [selectedId, filteredEvents, activeId]);

  // Cuộn đến sự kiện được chọn
  useEffect(() => {
    if (activeId && eventRefs.current[activeId]) {
      eventRefs.current[activeId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeId]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">LỊCH TẬP CỤ THỂ</h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
            </button>
            <FormModal table="workoutSchedule" type="create" />
          </div>
        </div>
      </div>
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold p-5 text-xl">
          Không có lịch tập nào phù hợp.
        </p>
      ) : (
        Object.keys(eventsByDay).map((day, index) => (
          <div key={index} className="mb-8">
            <h3 className="font-bold text-lg mb-2">{day}</h3>
            {eventsByDay[day].length === 0 ? (
              <p className="text-center text-gray-500 font-semibold border rounded p-4 mb-4">
                Lịch trống
              </p>
            ) : (
              eventsByDay[day].map((event) => {
                console.log("Event data for ID", event.id, event.extendedProps); // Thêm log
                const exercises = event.extendedProps.exercises || [];
                const isActive = activeId === event.id.toString();
                return (
                  <div
                    key={event.id}
                    id={event.id.toString()}
                    ref={(el) => {
                      eventRefs.current[event.id.toString()] = el;
                      if (isActive && el) {
                        el.classList.add("ring", "ring-orange-400");
                        setTimeout(() => el.classList.remove("ring", "ring-orange-400"), 2000);
                      }
                    }}
                    className={`border rounded p-4 mb-4 ${
                      isActive
                        ? "bg-gradient-to-r from-brown-red to-bright-orange text-white"
                        : "bg-base-100"
                    }`}
                  >
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      {new Date(event.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <strong>Nhóm cơ:</strong> {event.title}
                    </p>
                    <p>
                      <strong>Học viên:</strong> {event.extendedProps.student}
                    </p>
                    <p>
                      <strong>Huấn luyện viên:</strong> {event.extendedProps.trainer}
                    </p>
                    <p>
                      <strong>Gói tập:</strong>{" "}
                      {event.extendedProps.package || "Không có gói tập"}
                    </p>
                    <p>
                      <strong>Chương trình tập:</strong>{" "}
                      {event.extendedProps.program || "Không có chương trình tập"}
                    </p>
                    <p>
                      <strong>Lớp học:</strong>{" "}
                      {event.extendedProps.class || "Không có lớp học"}
                    </p>
                    <p>
                      <strong>Ghi chú:</strong>{" "}
                      {event.extendedProps.note || "Không có ghi chú"}
                    </p>
                    <h5 className="font-bold mt-4">Danh sách bài tập:</h5>
                    {exercises.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {exercises.map((exercise: any) => (
                          <li key={exercise.id}>
                            <strong>{exercise.name}</strong> ({exercise.muscleGroup}):{" "}
                            {exercise.sets} hiệp x {exercise.reps} lần - {exercise.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Không có bài tập nào.</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <FormModal
                        table="workoutSchedule"
                        type="update"
                        data={{
                          id: event.id,
                          NgayGioBatDau: event.start,
                          NgayGioKetThuc: event.end,
                          MaHV: event.extendedProps.studentId || 1,
                          MaHLV: event.extendedProps.trainerId || 1,
                          idMaGT: event.extendedProps.packageId ?? undefined,
                          idMaCTT: event.extendedProps.programId ?? undefined,
                          idMaLH: event.extendedProps.classId ?? undefined,
                          GhiChu: event.extendedProps.note ?? "",
                          baitap: event.extendedProps.exercises || [],
                        }}
                      />
                      <FormModal
                        table="workoutSchedule"
                        type="delete"
                        id={Number(event.id)}
                        onSuccess={onFormSuccess}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EventDetails;