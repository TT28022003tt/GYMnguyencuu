import TrainingPrograms from "../../components/TrainingPrograms";
import BodyUser from "../bodyuser/page";

const TrainingPlans = () => {
  return (
    <div className='h-full w-full p-4 flex items-start justify-center'>
      <div className="w-1/2"><TrainingPrograms/></div>
      <div className="w-1/2"><BodyUser/></div>
    </div>
  );
};

export default TrainingPlans;
