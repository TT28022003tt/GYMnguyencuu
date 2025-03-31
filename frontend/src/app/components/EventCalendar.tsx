"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { calendarEvents } from "../lib/data";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
	const [selectedEvent, setselectedEvent] = useState<any>(null);

	const getEventsForDate = (date: Date) => {
		return calendarEvents.filter(
		  (event) =>
			date >= new Date(event.start) && date <= new Date(event.end)
		);
	};
	
	  const handleDateClick = (date: Date) => {
		onChange(date); 
		setselectedEvent(null); 
	  };

	const handleEventClick = (eventTitle: any) => {
		setselectedEvent(eventTitle); 
		const event = calendarEvents.find((e) => e.title === eventTitle);
		if (event) {
		  onChange(new Date(event.start)); 
		}
  }
  
  return (
    <div className="p-4 rounded-md ">
			<Calendar className="rounded-lg" onChange={onChange} value={value} tileClassName={({date})=>{
				const events = getEventsForDate(date);
				if (events.length > 0) {
					const event = events[0];
					
				}
				return "";
			}}
			onClickDay={handleDateClick}
			/>
			<h1 className="text-lg font-semibold">EVENTS</h1>
			<div className="space-y-4 max-h-[250px] overflow-y-auto scrollbar-hide">
				{calendarEvents.map((event) => {
					const startDate = new Date(event.start);
					const endDate = new Date(event.end);
					const eventDays = [];
					for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
					  eventDays.push(new Date(d));
					}
					return(
						<div
							key={event.title}
							className={`p-2 rounded-md cursor-pointer bg-gradient-to from-brown-red to-bright-orange hover:bg-gradient-to-r ${
								selectedEvent === event.title
								? "bg-blue-300 text-white"
								: ""
							}`}
							style={{
								borderLeft: `5px solid `, 
							}}
							onClick={() => handleEventClick(event.title)} 
							>
							<h2 className="font-medium">{event.title}</h2>
							<p className="text-sm ">
								{new Date(event.start).toLocaleDateString()} -{" "}
								{new Date(event.end).toLocaleDateString()}
							</p>
						</div>
					)
				})}
			</div>
		</div>
  );
};

export default EventCalendar;