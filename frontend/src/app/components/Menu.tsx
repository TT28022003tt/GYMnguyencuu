import { role } from "../lib/data";
import Link from "next/link";
import { faAddressCard, faCalendarDay, faChartLine, faComment, faFileWaveform, faGear, faHouse, faIdBadge, faRightFromBracket, faStar, faTicket, faUser, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNutritionix } from "@fortawesome/free-brands-svg-icons";

const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: faHouse,
          label: "Home",
          href: "/",
          visible: ["admin", "trainer"],
        },
        {
          icon: faUser,
          label: "User",//quản lý các tài khoản truy cập
          href: "/listManagement/user",
          visible: ["admin"],
        },
        {
          icon: faCalendarDay,
          label: "Workout Schedule",
          href: "/listManagement/workoutSchedule",
          visible: ["admin", "trainer"],
        },
        {
          icon: faNutritionix,
          label: "Nutrition",
          href: "/listManagement/nutrition",
          visible: ["admin", "trainer"],
        },
        {
          icon: faStar,
          label: "Event",
          href: "/listManagement/event",
          visible: ["admin", "trainer"],//chỉ admin mới có quyền sửa
        },
        {
          icon: faAddressCard,
          label: "Membership",//quản lý khách hàng đăng ký thẻ hội viên 
          href: "/listManagement/membership",
          visible: ["admin", "trainer"], //chỉ admin mới có quyền sửa
        },
        {
          icon: faComment,
          label: "FeedBack",
          href: "/listManagement/feedback",
          visible: ["admin", "trainer"],//chỉ admin có quyền xóa còn phản hồi ( cả admin, trainer )
        },
        {
          icon: faUsersLine,
          label: "Class",
          href: "/listManagement/Class",
          visible: ["admin", "trainer"],
        },
        {
          icon: faChartLine,
          label: "Total",
          href: "/admin",
          visible: ["admin"],
        },
      ],
    },
  ];
  

  const Menu = () => {
    const currentRole = "admin";
    return (
      <div className="mt-4 text-sm ">
        {menuItems.map((i) => (
          <div className="flex flex-col gap-2" key={i.title}>
            {i.items.map((item) => {
              if (item.visible.includes(currentRole)) {
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md bg-gradient-to from-brown-red to-bright-orange hover:bg-gradient-to-r"
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-7 h-7" title={item.label} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
            })}
          </div>
        ))}
      </div>
    );
  };
  
  
  
export default Menu;