import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4"/>
      <input 
      type="text" 
      placeholder="Tìm Kiếm" 
      className="w-[200px] p-2 bg-transparent outline-none" />
    </div>
  );
};

export default TableSearch;