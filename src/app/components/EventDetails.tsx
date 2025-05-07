"use client";

import React, { useEffect, useRef, useState } from "react";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "@/contexts/useContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface EventDetailsProps {
  selectedId: string | null;
  events: any[];
  currentWeek: { start: string; end: string };
  onFormSuccess: () => void;
  onScrollToCalendar: (eventId: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ selectedId, events, currentWeek, onFormSuccess, onScrollToCalendar }) => {
  const { user } = useMyContext();
  const [activeId, setActiveId] = useState<string | null>(selectedId);
  const [eventsByDay, setEventsByDay] = useState<{ [key: string]: any[] }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Filter events by current week and search query
  useEffect(() => {
    const weekStart = dayjs(currentWeek.start);
    const weekEnd = dayjs(currentWeek.end);
    const weekEvents = events.filter((event) => {
      const eventDate = dayjs.utc(event.start);
      return eventDate.isAfter(weekStart.subtract(1, "day")) && eventDate.isBefore(weekEnd);
    });

    if (!searchQuery) {
      setFilteredEvents(weekEvents);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = weekEvents.filter((event) => {
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
  }, [searchQuery, events, currentWeek]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Group events by day
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

  // Scroll to selected event
  useEffect(() => {
    if (activeId && eventRefs.current[activeId]) {
      eventRefs.current[activeId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeId]);

  // Handle click on event to scroll to calendar
  const handleEventClick = (eventId: string) => {
    setActiveId(eventId);
    onScrollToCalendar(eventId);
  };

  return (
    <div className="p-6  rounded-lg shadow-lg border border-orange-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold ">LỊCH TẬP CỤ THỂ</h1>
        <div className="flex items-center gap-4">
          <FormModal table="workoutSchedule" type="create" onSuccess={onFormSuccess} />
        </div>
      </div>
      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-600 font-semibold p-5 text-xl">
          Không có lịch tập nào trong tuần này.
        </p>
      ) : (
        Object.keys(eventsByDay).map((day, index) => (
          <div key={index} className="mb-10">
            <h3 className="font-bold text-lg  mb-4">{day}</h3>
            {eventsByDay[day].length === 0 ? (
              <p className="text-center text-gray-600 font-semibold border border-orange-200 rounded p-4 mb-6">
                Lịch trống
              </p>
            ) : (
              eventsByDay[day].map((event) => {
                const exercises = event.extendedProps.exercises || [];
                const isActive = activeId === event.id.toString();
                return (
                  <div
                    key={event.id}
                    id={event.id.toString()}
                    ref={(el) => {
                      eventRefs.current[event.id.toString()] = el;
                      if (isActive && el) {
                        el.classList.add("ring", "ring-orange-600");
                        setTimeout(() => el.classList.remove("ring", "ring-orange-600"), 2000);
                      }
                    }}
                    onClick={() => handleEventClick(event.id.toString())}
                    className={`border rounded-lg p-6 mb-6 transition-all cursor-pointer ${
                      isActive ? "bg-orange-50 border-orange-600 shadow-md" : "bg-white border-orange-200"
                    } hover:shadow-lg hover:border-orange-600 hover:scale-102`}
                  >
                    <h4 className="font-semibold text-lg text-orange-600 mb-4">{event.title}</h4>
                    <p className="text-gray-800">
                      <strong>Thời gian:</strong>{" "}
                      {dayjs.utc(event.start).format("HH:mm")} - {dayjs.utc(event.end).format("HH:mm")}
                    </p>
                    <p className="text-gray-800">
                      <strong>Học viên:</strong> {event.extendedProps.student}
                    </p>
                    <p className="text-gray-800">
                      <strong>Huấn luyện viên:</strong> {event.extendedProps.trainer}
                    </p>
                    <p className="text-gray-800">
                      <strong>Gói tập:</strong>{" "}
                      {event.extendedProps.package || "Không có gói tập"}
                    </p>
                    <p className="text-gray-800">
                      <strong>Chương trình tập:</strong>{" "}
                      {event.extendedProps.program || "Không có chương trình tập"}
                    </p>
                    <p className="text-gray-800">
                      <strong>Lớp học:</strong>{" "}
                      {event.extendedProps.class || "Không có lớp học"}
                    </p>
                    <p className="text-gray-800">
                      <strong>Ghi chú:</strong>{" "}
                      {event.extendedProps.note || "Không có ghi chú"}
                    </p>
                    <h5 className="font-bold mt-4 text-gray-900">Danh sách bài tập:</h5>
                    {exercises.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {exercises.map((exercise: any) => (
                          <li key={exercise.id}>
                            <strong>{exercise.name}</strong> ({exercise.muscleGroup}):{" "}
                            {exercise.sets} hiệp x {exercise.reps} lần - {exercise.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Không có bài tập nào.</p>
                    )}
                    <div className="flex gap-2 mt-6">
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
                        onSuccess={onFormSuccess}
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