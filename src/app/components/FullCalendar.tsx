"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import EventDetails from "./EventDetails";
import { useMyContext } from "@/contexts/useContext";
import { toast } from "react-toastify";

interface ScheduleEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  extendedProps: {
    student: string;
    trainer: string;
    exercises: { id: number; name: string; muscleGroup: string; reps: number; sets: number; description: string }[];
    package?: string;
    packageType?: string;
    studentId?: number;
    trainerId?: number;
    packageId?: number;
    programId?: number;
    classId?: number;
    note?: string;
  };
}

const FullCalendars = () => {
  const { user } = useMyContext();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ScheduleEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Lấy dữ liệu từ API
  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedule", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu lịch tập");
      }

      const data: ScheduleEvent[] = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Lọc sự kiện khi searchQuery thay đổi
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
            (ex) =>
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

  // Xử lý sự kiện click trên lịch
  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.id);
  };

  // Làm mới dữ liệu khi form thành công
  const handleFormSuccess = () => {
    fetchSchedules();
    toast.success("Thao tác thành công!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8">LỊCH TẬP</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={viLocale}
        events={filteredEvents}
        eventClick={handleEventClick}
        height="auto"
        slotEventOverlap={false}
        eventOverlap={false}
        dayMaxEventRows={true}
        eventContent={(eventInfo) => (
          <div className="flex flex-col justify-center items-center h-full text-center">
            {eventInfo.event.start && eventInfo.event.end && (
              <>
                {new Date(eventInfo.event.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(eventInfo.event.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}

            <div>HLV: {eventInfo.event.extendedProps.trainer}</div>
            <div>Bài tập: {eventInfo.event.title}</div>
          </div>
        )}
        slotMinTime="05:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
      />

      <div className="mt-8">
        <EventDetails selectedId={selectedEvent} events={filteredEvents} onFormSuccess={handleFormSuccess} />
      </div>
    </div>
  );
};

export default FullCalendars;