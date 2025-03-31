import FullCalendars from "@/app/components/FullCalendar";


const SchedulePage = () => {
  return (
	<div className='h-full w-full p-4'>
    <h1 className="text-2xl text-white font-bold text-center"> Lịch Tập (Schedule)</h1>
    <FullCalendars/>
  </div>
  );
};

export default SchedulePage;