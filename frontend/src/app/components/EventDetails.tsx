import { calendarEvents, eventDetail, role } from "../lib/data";
import React, { useEffect, useRef, useState } from "react";
import FormModal from "./FormModal";
import TableSearch from "./TableSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

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
			setActiveId(null);
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
		setEventsByDay(eventsByDayData);
	}, [selectedId, events, activeId]);

	const getExercisesByEvent = (eventId: string) => {
		return eventDetail.filter((exercise) => exercise.idcalendar === parseInt(eventId));
	};

	useEffect(() => {
		if (activeId && eventRefs.current[activeId]) {
			eventRefs.current[activeId]?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [activeId]);

	return (
		<div className=''>
			<div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full md:w-auto">
				<h1 className="text-2xl py-4">LỊCH TẬP CỤ THỂ</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						<button className="w-8 h-8  flex items-center justify-center">
							<FontAwesomeIcon icon={faFilter} className="w-5 h-5" />
						</button>
						{role === "admin" && <FormModal table="workoutSchedule" type="create" />
						}
					</div>
				</div>
			</div>
			{events.length === 0 ? (
				<p className="text-center text-gray-500 font-semibold p-5 text-xl">Tuần này không có lịch.</p>
			) : (
				Object.keys(EventsByDay).map((day, index) => (
					<div key={index} className="mb-8">
						<h3 className="font-bold text-lg mb-2">{day}</h3>
						{EventsByDay[day].length === 0 ? (
							<p className="text-center text-gray-500 font-semibold border rounded p-4 mb-4">Lịch trống</p>
						) : (
							EventsByDay[day].map((event) => {
								const exercises = getExercisesByEvent(event.id);
								const isActive = activeId === event.id.toString();
								return (
									<div key={event.id} id={event.id.toString()} ref={(el) => {
										eventRefs.current[event.id.toString()] = el
									}} className={`border rounded p-4 mb-4 ${isActive ? "bg-gradient-to-r from-brown-red to-bright-orange text-white" : "bg-base-100"
										}`}>
										<p>
											<strong>Thời gian:</strong>{" "}
											{new Date(event.start).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}{" "}-{" "}
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
										{exercises.length > 0 ? (
											<ul className="list-disc list-inside">
												{exercises.map((exercise) => (
													<li key={exercise.id}>
														<strong>{exercise.title}</strong>: {exercise.notes}
													</li>
												))}
											</ul>
										) : (
											<p>Không có bài tập nào.</p>
										)}

										{role === "admin" && (
											<div className="flex gap-2 mt-4">
												<FormModal table="workoutSchedule" type="update" data={event} />
												<FormModal table="workoutSchedule" type="delete" id={event.id} />
											</div>
										)}
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
