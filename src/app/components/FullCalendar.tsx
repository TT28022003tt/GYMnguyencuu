"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import EventDetails from "./EventDetails";
import { useMyContext } from "@/contexts/useContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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
  const [currentWeek, setCurrentWeek] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const calendarRef = useRef<FullCalendar>(null);

  // Fetch schedules from API
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

  // Filter events based on search query
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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle event click to scroll to details
  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.id);
    const detailsSection = document.getElementById("event-details");
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle week change to update current week
  const handleDatesSet = (dateInfo: any) => {
    setCurrentWeek({
      start: dayjs(dateInfo.start).format("YYYY-MM-DD"),
      end: dayjs(dateInfo.end).format("YYYY-MM-DD"),
    });
  };

  // Scroll back to calendar and highlight event
  const handleScrollToCalendar = (eventId: string) => {
    setSelectedEvent(eventId);
  
    // Ép kiểu an toàn nếu TypeScript không nhận ra .el
    const calendarEl = (calendarRef.current as any)?.el;
    if (calendarEl) {
      calendarEl.scrollIntoView({ behavior: "smooth" });
    }
  };
  

  // Handle form success
  const handleFormSuccess = () => {
    fetchSchedules();
    toast.success("Thao tác thành công!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-transparent border-t-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold ">LỊCH TẬP</h1>
        </div>
        <div className=" rounded-lg shadow-lg p-4 border border-orange-200">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={viLocale}
            timeZone="UTC"
            events={filteredEvents}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            height="auto"
            slotEventOverlap={false}
            eventOverlap={false}
            dayMaxEventRows={true}
            eventContent={(eventInfo) => (
              <div className="flex flex-col justify-center items-center h-full text-center p-2 bg-orange-100 rounded-md hover:bg-orange-200 hover:shadow-md hover:scale-105 transition cursor-pointer">
                {eventInfo.event.start && eventInfo.event.end && (
                  <p className="text-sm font-semibold text-gray-900">
                    {dayjs.utc(eventInfo.event.start).format("HH:mm")} - {dayjs.utc(eventInfo.event.end).format("HH:mm")}
                  </p>
                )}
                <p className="text-sm text-gray-800">HLV: {eventInfo.event.extendedProps.trainer}</p>
                <p className="text-sm font-bold text-orange-600">{eventInfo.event.title}</p>
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
        </div>
        <div id="event-details" className="mt-12">
          <EventDetails
            selectedId={selectedEvent}
            events={filteredEvents}
            currentWeek={currentWeek}
            onFormSuccess={handleFormSuccess}
            onScrollToCalendar={handleScrollToCalendar}
          />
        </div>
      </div>
    </div>
  );
};

export default FullCalendars;