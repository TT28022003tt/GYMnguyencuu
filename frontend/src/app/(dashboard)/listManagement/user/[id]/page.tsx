import Announcement from "@/app/components/Announcements";
import FormModal from "@/app/components/FormModal";
import InBody from "@/app/components/InBody";
import Performance from "@/app/components/Performance";
import { role } from "@/app/lib/data";
import { faCircleUser, faEnvelope, faKey, faMarsAndVenus, faPhone, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const UserId = () => {
  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* USER INFO CARD */}
        <div className=" py-6 rounded-md flex gap-4">
          <div className="w-1/3">
            <Image 
              src="/images/123.jpg" 
              alt="User Photo" 
              width={144} 
              height={144} 
              className="w-36 h-36 rounded-full object-cover" 
            />
          </div>
          <div className="w-2/3 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Leonard Snyder</h1>
              <FormModal table="user" type="update" data={{
                id: 1,
                accountId: "ACC123456",
                userName: "leonardsnyder",
                email: "leonard.snyder@gmail.com",
                password: "securepassword",
                phone: "+1 987 654 3210",
                role: "Admin",
                status: "Active",
                fullName: "Leonard Snyder",
                sex:"nữ",//
                photo: "/images/123.jpg",
              }} />
            </div>
            <p className="text-sm text-gray-500">User profile details and status.</p>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4"/>
                <span>leonard.snyder@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4"/>
                <span>+1 987 654 3210</span>
              </div>
              <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMarsAndVenus} className="w-4 h-4" />
                <span>Nữ</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserTie} className="w-4 h-4"/>
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4"/>
                <span>leonardsnyder</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faKey}  className="w-4 h-4"/>
                <span >securepassword</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="">
            <InBody/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-secondary p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-white">
            <Link className="p-3 rounded-md " href="/healthconsultation">healthconsultation</Link>
            <Link className="p-3 rounded-md " href="/">Settings</Link>
            <Link className="p-3 rounded-md " href="/schedule">Schedule</Link>
          </div>
        </div>
        <Performance role={role} />
        <Announcement />
      </div>
    </div>
  );
};

export default UserId;
