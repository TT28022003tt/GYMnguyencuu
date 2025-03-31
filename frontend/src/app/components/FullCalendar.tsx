"use client"

import {fullcalendarEvents } from "../lib/data";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { useEffect, useState } from 'react';
import EventDetails from "./EventDetails";


const FullCalendars = () => {
  const [currentStartDate, setCurrentStartDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(fullcalendarEvents.map(event=>({
    ...event,// Sao chép toàn bộ thuộc tính từ `event`
    id: event.id.toString(),
  })));

  const handleDatesSet = (info: any) => {
    setCurrentStartDate(new Date(info.start));
  };

  useEffect(() => {
    const startOfWeek = new Date(currentStartDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Thứ 2
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Chủ Nhật
    endOfWeek.setHours(23, 59, 59, 999);

    // Lọc sự kiện trong tuần
    const filteredEvents = fullcalendarEvents.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });

    setEvents(filteredEvents.map((event) => ({
      ...event,
      id: event.id.toString(),
    })));
  }, [currentStartDate]);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const handleEventClick = (info: any) => {
    const detailId = info.event.id;
    setSelectedEvent(detailId); 
  };
  return (
    <div className="">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={viLocale}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        slotEventOverlap={false}
        eventOverlap={false}
        dayMaxEventRows={true}
        eventContent={(eventInfo) => (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <div>
              {eventInfo.event.start ? new Date(eventInfo.event.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }):"N/A"} - 
              {eventInfo.event.end ? new Date(eventInfo.event.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }):"N/A"}
              </div>
            <div>HLV: {eventInfo.event.extendedProps.trainer}</div>
            <div>Bài Tập: {eventInfo.event.title}</div>
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
        datesSet={handleDatesSet}
      />
      <div className="">
        <EventDetails selectedId={selectedEvent} events={events}/>
      </div>
    </div>
  );
};

export default FullCalendars;