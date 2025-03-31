import { calendarEvents, eventDetail } from "../lib/data";
import React, { useEffect, useRef, useState } from "react";

interface EventDetailsProps {
	selectedId: string | null;
	events: any[];
}  

const EventDetails: React.FC<EventDetailsProps> = ({ selectedId, events }) => {
	const [activeId, setActiveId] = useState<string | null>(selectedId);
	const [EventsByDay, setEventsByDay] = useState<{ [key: string]: any[] }>({});
	const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	useEffect(() => {
		if (events.length === 0) {
		  setActiveId(null); // Reset activeId nếu không có sự kiện
		} else if (selectedId && selectedId !== activeId) {
		  setActiveId(selectedId);
		}
	
		const getEventsByDay = (events: any[]) => {
		  const dayOfWeek = [
			"CHỦ NHẬT",
			"THỨ 2",
			"THỨ 3",
			"THỨ 4",
			"THỨ 5",
			"THỨ 6",
			"THỨ 7",
		  ];
		  const EventsByDay: { [key: string]: any[] } = {};
		  dayOfWeek.forEach((day) => {
			EventsByDay[day] = [];
		  });
	
		  events.forEach((event) => {
			const eventDate = new Date(event.start);
			const day = dayOfWeek[eventDate.getDay()];
			EventsByDay[day].push(event);
		  });
	
		  return EventsByDay;
		};
	
		const eventsByDayData = getEventsByDay(events);
		setEventsByDay(eventsByDayData); // Cập nhật events theo ngày
	
	  }, [selectedId, events, activeId]);
	
	  const getExercisesByEvent = (eventId: string) => {
		return eventDetail.filter((exercise) => exercise.idcalendar === parseInt(eventId));
	  };
	
	  // Cuộn đến phần tử khi activeId thay đổi
	  useEffect(() => {
		if (activeId && eventRefs.current[activeId]) {
		  eventRefs.current[activeId]?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [activeId]);
	
  return (
	<div className=''>
		{events.length===0?(
			<p className="text-center text-gray-500 font-semibold p-5 text-xl">Tuần này không có lịch.</p>
		):(
			Object.keys(EventsByDay).map((day,index)=>(
				<div key={index} className="mb-8">
					<h3 className="font-bold text-lg mb-2">{day}</h3>
					{EventsByDay[day].length===0?(
						<p className="text-center text-gray-500 font-semibold border rounded p-4 mb-4">Lịch trống</p>
					):(
						EventsByDay[day].map((event)=>{
							const exercises = getExercisesByEvent(event.id);
							const isActive = activeId === event.id.toString();
							return(
								<div key={event.id} id={event.id.toString()} ref={(el)=>{
									eventRefs.current[event.id.toString()]=el
								}} className={`border rounded p-4 mb-4 ${
									isActive ? "bg-gradient-to-r from-brown-red to-bright-orange" : "bg-base-100"
								  }`}>
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
										<strong>Huấn luyện viên:</strong> {event.trainer}
									</p>
									<h5 className="font-bold mt-4">Danh sách bài tập:</h5>
									{exercises.length>0?(
										<ul className="list-disc list-inside">
											{exercises.map((exercise)=>(
												<li key={exercise.id}>
													<strong>{exercise.title}</strong>: {exercise.notes}
												</li>
											))}
										</ul>
									):(
										<p>Không có bài tập nào.</p>
									)}
								</div>
							)
						})
					)}
				</div>
			))
		)}
	</div>
  );
};

export default EventDetails;