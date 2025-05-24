import { role } from "../lib/data";
import Link from "next/link";
import { faAddressCard, faCalendarDay, faChartLine, faComment, faFileWaveform, faGear, faHouse, faIdBadge, faPersonChalkboard, faRightFromBracket, faStar, faTicket, faUser, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNutritionix } from "@fortawesome/free-brands-svg-icons";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: faHouse,
        label: "Trang Chủ",
        href: "/",
        visible: ["admin", "trainer"],
      },
      {
        icon: faUser,
        label: "Người Dùng",
        href: "/listManagement/user",
        visible: ["admin"],
      },
      {
        icon: faPersonChalkboard,
        label: "Huấn Luyện Viên",
        href: "/listManagement/trainer",
        visible: ["admin", "trainer"],
      },
      // {
      //   icon: faCalendarDay,
      //   label: "Lịch Tập",
      //   href: "/listManagement/workoutSchedule",
      //   visible: ["admin", "trainer"],
      // },
      // {
      //   icon: faNutritionix,
      //   label: "Dinh Dưỡng",
      //   href: "/listManagement/nutrition",
      //   visible: ["admin", "trainer"],
      // },
      // {
      //   icon: faStar,
      //   label: "Sự Kiện",
      //   href: "/listManagement/event",
      //   visible: ["admin", "trainer"], // chỉ admin mới có quyền sửa
      // },
      {
        icon: faAddressCard,
        label: "Thành Viên",
        href: "/listManagement/membership",
        visible: ["admin", "trainer"],
      },
      {
        icon: faComment,
        label: "Phản Hồi",
        href: "/listManagement/feedback",
        visible: ["admin", "trainer"],
      },
      {
        icon: faUsersLine,
        label: "Lớp Học",
        href: "/listManagement/Class",
        visible: ["admin", "trainer"],
      },
      {
        icon: faChartLine,
        label: "Tổng Quan",
        href: "/admin",
        visible: ["admin"],
      },
    ],
  },
];


const Menu = () => {
  const currentRole = role;
  return (
    <div className="mt-4 text-sm ">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2 " key={i.title}>
          {i.items.map((item) => {
            if (item.visible.includes(currentRole)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md bg-gradient-to from-brown-red to-bright-orange hover:bg-gradient-to-r "
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