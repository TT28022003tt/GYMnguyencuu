import React from "react";
import avatar from "../components/Assets/logo.jpg";

interface FormSettingProps {
  onClose: () => void;
}

const FormSetting: React.FC<FormSettingProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[80%] h-[80%] flex shadow-lg overflow-hidden">
        
       
        <div className="w-1/3 border-r p-4 flex flex-col items-center">
        <img src={avatar.src} alt="Avatar" className="rounded-full h-80 mb-4 w-auto object-cover" />
          <h2 className="text-lg font-semibold mb-6">.....</h2>
          <div className="w-full">
            <button className="block w-full text-left py-2 px-4 hover:bg-gray-200 text-blue-500 font-medium">Setting</button>
            <button className="block w-full text-left py-2 px-4 hover:bg-gray-200">Account</button>
          </div>
        </div>

        
        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-semibold mb-6">Setting</h2>

          <form className="space-y-4">
            <input type="text" placeholder="EMAIL" className="w-full border p-3 rounded" />
            <input type="text" placeholder="SỐ ĐIỆN THOẠI" className="w-full border p-3 rounded" />
            <input type="text" placeholder="ĐỊA CHỈ" className="w-full border p-3 rounded" />
            <input type="text" placeholder="GIỚI TÍNH" className="w-full border p-3 rounded" />

            <div className="flex space-x-4 mt-6">
              <button type="submit" className="flex-1 border rounded-full py-2 font-medium hover:bg-gray-100">UPDATE</button>
              <button type="button" onClick={onClose} className="flex-1 border rounded-full py-2 font-medium hover:bg-gray-100">CANCEL</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default FormSetting;
