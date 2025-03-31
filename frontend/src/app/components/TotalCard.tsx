import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const UserCard = ({type,onSelect}:{type:string; onSelect:(type:string)=>void}) => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  return (
    <div onClick={()=> onSelect(type)} className='cursor-pointer rounded-2xl bg-secondary p-4 flex-1 min-w-[130px]'>
        <div className=" flex justify-between items-center">
            <span className="text-[10px]  px-2 py-1 rounded-full ">{formattedDate}</span>
            <FontAwesomeIcon icon={faCircleQuestion} className="w-5 h-5" /> 
        </div>
        <h1 className="text-2xl font-semibold my-4">1,2345</h1>
        <h2 className="capitalize text-sm font-medium ">{type}</h2>
    </div>
  );
};

export default UserCard;