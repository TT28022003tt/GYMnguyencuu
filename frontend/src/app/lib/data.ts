export const role="admin"

export const accountsData = [
  {
    id: 1,
    accountId: "ACC001",
    userName: "johndoe",
    password: "password123",
    phone: "1234567890",
    role: "admin",
    status: "active",
    email: "john@doe.com",
    fullName: "John Doe",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    accountId: "ACC002",
    userName: "janedoe",
    password: "password123",
    phone: "1234567890",
    role: "admin",
    status: "active",
    email: "jane@doe.com",
    fullName: "Jane Doe",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 3,
    accountId: "ACC003",
    userName: "mikegeller",
    password: "password123",
    phone: "1234567890",
    role: "trainer",
    status: "inactive",
    email: "mike@geller.com",
    fullName: "Mike Geller",
    photo:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 4,
    accountId: "ACC004",
    userName: "jayfrench",
    password: "password123",
    phone: "1234567890",
    role: "trainer",
    status: "active",
    email: "jay@gmail.com",
    fullName: "Jay French",
    photo:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 5,
    accountId: "ACC005",
    userName: "janesmith",
    password: "password123",
    phone: "1234567890",
    role: "customer",
    status: "active",
    email: "jane@gmail.com",
    fullName: "Jane Smith",
    photo:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 6,
    accountId: "ACC006",
    userName: "annasantiago",
    password: "password123",
    phone: "1234567890",
    role: "customer",
    status: "inactive",
    email: "anna@gmail.com",
    fullName: "Anna Santiago",
    photo:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 7,
    accountId: "ACC007",
    userName: "allenblack",
    password: "password123",
    phone: "1234567890",
    role: "admin",
    status: "active",
    email: "allen@black.com",
    fullName: "Allen Black",
    photo:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 8,
    accountId: "ACC008",
    userName: "opheliacastro",
    password: "password123",
    phone: "1234567890",
    role: "admin",
    status: "active",
    email: "ophelia@castro.com",
    fullName: "Ophelia Castro",
    photo:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 9,
    accountId: "ACC009",
    userName: "derekbriggs",
    password: "password123",
    phone: "1234567890",
    role: "trainer",
    status: "inactive",
    email: "derek@briggs.com",
    fullName: "Derek Briggs",
    photo:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 10,
    accountId: "ACC010",
    userName: "johnglover",
    password: "password123",
    phone: "1234567890",
    role: "customer",
    status: "active",
    email: "john@glover.com",
    fullName: "John Glover",
    photo:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    address: "123 Main St, Anytown, USA",
  },
];

export const workoutSchedulesData = [
  {
    id: 1,
    scheduleId: "SCH001",
    customerName: "Jane Smith",
    trainerName: "Mike Geller",
    sessionProgress: "12/20",
    startDate: "2024-02-01",
    status: "ongoing",
  },
  {
    id: 2,
    scheduleId: "SCH002",
    customerName: "John Glover",
    trainerName: "Jay French",
    sessionProgress: "5/15",
    startDate: "2024-03-10",
    status: "ongoing",
  },
  {
    id: 3,
    scheduleId: "SCH003",
    customerName: "Anna Santiago",
    trainerName: "Derek Briggs",
    sessionProgress: "20/20",
    startDate: "2024-01-20",
    status: "completed",
  },
  {
    id: 4,
    scheduleId: "SCH004",
    customerName: "John Doe",
    trainerName: "Mike Geller",
    sessionProgress: "8/10",
    startDate: "2024-02-15",
    status: "ongoing",
  },
  {
    id: 5,
    scheduleId: "SCH005",
    customerName: "Jane Doe",
    trainerName: "Jay French",
    sessionProgress: "10/20",
    startDate: "2024-03-01",
    status: "ongoing",
  },
  
];

export const eventData = [
  {
    id: 1,
    eventId: "EVT001",
    eventName: "FIRE Fitness Opening Day",
    startTime: "2025-03-01 09:00",
    endTime: "2025-03-01 18:00",
    location: "FIRE Fitness Center, District 1",
    participantGroup: ["Bất kỳ ai"],
    photo: "/images/events/opening_day.jpg",
  },
  {
    id: 2,
    eventId: "EVT002",
    eventName: "FIRE-PLUS Member Exclusive",
    startTime: "2025-03-15 10:00",
    endTime: "2025-03-15 16:00",
    location: "FIRE Fitness Center, District 3",
    participantGroup: ["Bất kỳ ai", "card FIRE-VIP"],
    photo: "/images/events/plus_exclusive.jpg",
  },
  {
    id: 3,
    eventId: "EVT003",
    eventName: "Yoga for FIRE-VIP",
    startTime: "2025-04-05 07:00",
    endTime: "2025-04-05 11:00",
    location: "FIRE Yoga Studio, District 2",
    participantGroup: ["card FIRE-VIP"],
    photo: "/images/events/yoga_vip.jpg",
  },
];

export const membershipsData = [
  {
    id: 1,
    cardId: "FIRE001",
    accountId: "ACC001",
    memberName: "Nguyen Van A",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    cardType: "FIRE",
    photo: "/images/memberships/nguyenvana.jpg",
    status: "Hoạt động",
  },
  {
    id: 2,
    cardId: "FIRE002",
    accountId: "ACC002",
    memberName: "Tran Thi B",
    startDate: "2024-06-15",
    endDate: "2025-06-14",
    cardType: "FIRE-PLUS",
    photo: "/images/memberships/tranthib.jpg",
    status: "Hoạt động",
  },
  {
    id: 3,
    cardId: "FIRE003",
    accountId: "ACC003",
    memberName: "Le Van C",
    startDate: "2023-03-10",
    endDate: "2024-03-09",
    cardType: "FIRE-VIP",
    photo: "/images/memberships/levanc.jpg",
    status: "Hết hạn",
  },
  {
    id: 4,
    cardId: "FIRE004",
    accountId: "ACC004",
    memberName: "Pham Thi D",
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    cardType: "FIRE",
    photo: "/images/memberships/phamthid.jpg",
    status: "Hoạt động",
  },
  {
    id: 5,
    cardId: "FIRE005",
    accountId: "ACC005",
    memberName: "Hoang Van E",
    startDate: "2023-11-20",
    endDate: "2024-11-19",
    cardType: "FIRE-PLUS",
    photo: "/images/memberships/hoangvane.jpg",
    status: "Hoạt động",
  },
];

export const feedbackData = [
  {
    id: 1,
    idAccount: "ACC001",
    customerName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    sentDate: "2025-02-18",
    rating: 4,
    feedbackType: "Chất lượng dịch vụ",
    responder: "N/A",
    responseTime: "N/A",
    status: "Chưa phản hồi",
    photo: "/images/memberships/nguyenvana.jpg",

  },
  {
    id: 2,
    idAccount: "ACC002",
    customerName: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    sentDate: "2025-02-17",
    rating: 5,
    feedbackType: "ChatBoxAI",
    responder: "Admin",
    responseTime: "2025-02-18 10:30",
    status: "Đã phản hồi",
    photo: "/images/memberships/nguyenvana.jpg",

  },
  {
    id: 3,
    idAccount: "ACC003",
    customerName: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0934567890",
    sentDate: "2025-02-16",
    rating: 3,
    feedbackType: "Chất lượng dịch vụ",
    responder: "N/A",
    responseTime: "N/A",
    status: "Chưa phản hồi",
    photo: "/images/memberships/nguyenvana.jpg",

  },
  {
    id: 4,
    idAccount: "ACC004",
    customerName: "Hoàng Thị D",
    email: "hoangthid@example.com",
    phone: "0978123456",
    sentDate: "2025-02-15",
    rating: 2,
    feedbackType: "ChatBoxAI",
    responder: "Admin",
    responseTime: "2025-02-16 14:00",
    status: "Đã phản hồi",
    photo: "/images/memberships/nguyenvana.jpg",
  },
];

export const classData = [
  {
    id: 1,
    className: "Yoga cơ bản",
    startTime: "2025-02-20 08:00",
    endTime: "2025-02-20 09:30",
    sessionDuration: "90 phút",
    location: "Phòng tập 101",
    trainerName: "Nguyễn Văn A",
    trainerEmail: "nguyenvana@example.com",
    photo:"/images/memberships/nguyenvana.jpg",
    currentStudents: 15,
    maxStudents: 20,
    fee: "500,000 VND",
    description: "Lớp học Yoga cơ bản giúp cải thiện sức khỏe và tinh thần cho người mới bắt đầu.",
  },
  {
    id: 2,
    className: "Aerobic nâng cao",
    startTime: "2025-02-21 18:00",
    endTime: "2025-02-21 19:30",
    sessionDuration: "90 phút",
    location: "Phòng tập 202",
    trainerName: "Trần Thị B",
    trainerEmail: "tranthib@example.com",
    photo:"/images/memberships/nguyenvana.jpg",
    currentStudents: 10,
    maxStudents: 15,
    fee: "600,000 VND",
    description: "Lớp Aerobic nâng cao phù hợp với những người đã có nền tảng và muốn tăng cường sức khỏe tim mạch.",
  },
  {
    id: 3,
    className: "Zumba năng động",
    startTime: "2025-02-22 17:00",
    endTime: "2025-02-22 18:30",
    sessionDuration: "90 phút",
    location: "Phòng tập 303",
    trainerName: "Lê Minh C",
    trainerEmail: "leminhc@example.com",
    photo:"/images/memberships/nguyenvana.jpg",
    currentStudents: 12,
    maxStudents: 20,
    fee: "550,000 VND",
    description: "Lớp Zumba giúp đốt cháy calo và mang lại niềm vui qua các bài nhảy sôi động.",
  },
];


export const calendarEvents = [
	{
	  title: "New Year Promotion: 25% Off All Orders",
	  allDay: true,
	  start: new Date(2025, 0, 1), // January 1, 2025
	  end: new Date(2025, 0, 31), // January 31, 2025
	},
	{
	  title: "Exclusive Sale: Buy 3 Get 1 Free",
	  allDay: true,
	  start: new Date(2025, 0, 10), // January 10, 2025
	  end: new Date(2025, 0, 15), // January 15, 2025
	},
	{
	  title: "Author Meetup: Fiction Writers of 2025",
	  allDay: false,
	  start: new Date(2025, 0, 14, 16, 0), // January 14, 2025, 4:00 PM
	  end: new Date(2025, 0, 14, 18, 0), // January 14, 2025, 6:00 PM
	},
	{
	  title: "Flash Sale: Sci-Fi Books - 40% Off",
	  allDay: true,
	  start: new Date(2025, 0, 20), // January 20, 2025
	  end: new Date(2025, 0, 20), // January 20, 2025
	},
	{
	  title: "Book Club: Discussing 'The Future Chronicles'",
	  allDay: false,
	  start: new Date(2025, 0, 22, 17, 0), // January 22, 2025, 5:00 PM
	  end: new Date(2025, 0, 22, 19, 0), // January 22, 2025, 7:00 PM
	},
	{
	  title: "Spring Collection Pre-Order Campaign",
	  allDay: true,
	  start: new Date(2025, 0, 25), // January 25, 2025
	  end: new Date(2025, 1, 5), // February 5, 2025
	},
	{
	  title: "Limited Edition: Hardcover Books Launch",
	  allDay: false,
	  start: new Date(2025, 0, 30, 11, 0), // January 30, 2025, 11:00 AM
	  end: new Date(2025, 0, 30, 13, 0), // January 30, 2025, 1:00 PM
	},
	{
	  title: "Weekly Reading Challenge: Sign Up Now!",
	  allDay: true,
	  start: new Date(2025, 0, 5), // January 5, 2025
	  end: new Date(2025, 0, 12), // January 12, 2025
	},
	{
	  title: "Charity Book Drive",
	  allDay: true,
	  start: new Date(2025, 0, 8), // January 8, 2025
	  end: new Date(2025, 0, 31), // January 31, 2025
	},
	{
	  title: "One-Day Event: Children's Book Giveaway",
	  allDay: true,
	  start: new Date(2025, 0, 18), // January 18, 2025
	  end: new Date(2025, 0, 18), // January 18, 2025
	},
];

export const fullcalendarEvents = [
  {
    id:1,
    title: "Tập ngực",
    start: new Date(2025, 0, 19, 5, 0, 0), // Ngày 19 tháng 1, 2025, từ 5:00 AM
    end: new Date(2025, 0, 19, 6, 0, 0),   // Đến 6:00 AM
    trainer: "Tâm",
  },
  {
    id:2,
    title: "Tập mông",
    start: new Date(2025, 0, 19, 7, 0, 0), // Ngày 19 tháng 1, 2025, từ 5:00 AM
    end: new Date(2025, 0, 19, 8, 0, 0),   // Đến 6:00 AM
    trainer: "Tâm",
  },
  {
    id:3,
    title: "Tập mông",
    start: new Date(2025, 0, 20, 7, 0, 0), // Ngày 20 tháng 1, 2025, từ 7:00 AM
    end: new Date(2025, 0, 20, 8, 0, 0),   // Đến 8:00 AM
    trainer: "Lan",
  },
  {
    id:4,
    title: "Tập mông",
    start: new Date(2025, 0, 20, 17, 0, 0), // Ngày 20 tháng 1, 2025, từ 7:00 AM
    end: new Date(2025, 0, 20, 18, 0, 0),   // Đến 8:00 AM
    trainer: "Lan",
  },
  {
    id:5,
    title: "Tập lưng",
    start: new Date(2025, 0, 21, 5, 0, 0), // Ngày 21 tháng 1, 2025, từ 5:00 AM
    end: new Date(2025, 0, 21, 6, 0, 0),   // Đến 6:00 AM
    trainer: "Mai",
  },
  {
    id:6,
    title: "Tập vai",
    start: new Date(2025, 0, 22, 6, 0, 0), // Ngày 22 tháng 1, 2025, từ 6:00 AM
    end: new Date(2025, 0, 22, 7, 0, 0),   // Đến 7:00 AM
    trainer: "Tâm",
  },
  {
    id:7,
    title: "Tập ngực",
    start: new Date(2025, 0, 23, 5, 0, 0), // Ngày 23 tháng 1, 2025, từ 5:00 AM
    end: new Date(2025, 0, 23, 6, 0, 0),   // Đến 6:00 AM
    trainer: "Lan",
  },
  {
    id:8,
    title: "Tập mông",
    start: new Date(2025, 0, 24, 7, 0, 0), // Ngày 24 tháng 1, 2025, từ 7:00 AM
    end: new Date(2025, 0, 24, 8, 0, 0),   // Đến 8:00 AM
    trainer: "Mai",
  },
  {
    id:9,
    title: "Tập lưng",
    start: new Date(2025, 0, 25, 5, 0, 0), // Ngày 25 tháng 1, 2025, từ 5:00 AM
    end: new Date(2025, 0, 25, 6, 0, 0),   // Đến 6:00 AM
    trainer: "Tâm",
  },
  {
    id:10,
    title: "Tập lưng",
    start: new Date(2025, 0, 26, 5, 0, 0),
    end: new Date(2025, 0, 26, 6, 0, 0),  
    trainer: "Tâm",
  },
];
export const eventDetail = [
  // idcalendar 1 - Ngực
  {
    id: 1,
    idcalendar: 1,
    title: "Dumbbell Bench Press",
    notes: "4 sets x 12 reps, tạ 5kg, tập trung phát triển cơ ngực giữa.",
  },
  {
    id: 2,
    idcalendar: 1,
    title: "Incline Dumbbell Press",
    notes: "4 sets x 12 reps, tạ 5kg, tập trung vào cơ ngực trên.",
  },
  {
    id: 3,
    idcalendar: 1,
    title: "Chest Fly Machine",
    notes: "4 sets x 12 reps, nhẹ nhàng nhưng hiệu quả cho cơ ngực ngoài.",
  },
  {
    id: 4,
    idcalendar: 1,
    title: "Push-ups",
    notes: "4 sets x 15 reps, bài tập bodyweight để tăng cường cơ ngực và vai.",
  },

  // idcalendar 2 - Mông
  {
    id: 5,
    idcalendar: 2,
    title: "Barbell Hip Thrust",
    notes: "4 sets x 10-12 reps, tạ 20kg + thanh đòn, tập trung vào cơ mông và hông.",
  },
  {
    id: 6,
    idcalendar: 2,
    title: "Bulgarian Split Squat",
    notes: "4 sets x 10-12 reps mỗi chân, tập trung mông và đùi sau.",
  },
  {
    id: 7,
    idcalendar: 2,
    title: "Glute Bridge",
    notes: "4 sets x 12-15 reps, tập trung mông dưới.",
  },
  {
    id: 8,
    idcalendar: 2,
    title: "Cable Kickbacks",
    notes: "4 sets x 15 reps mỗi chân, hỗ trợ nâng mông săn chắc.",
  },

  // idcalendar 3 - Đùi
  {
    id: 9,
    idcalendar: 3,
    title: "Leg Press",
    notes: "4 sets x 12 reps, hỗ trợ phát triển cơ đùi trước và sau.",
  },
  {
    id: 10,
    idcalendar: 3,
    title: "Romanian Deadlift",
    notes: "4 sets x 10-12 reps, tập trung cơ đùi sau và hông.",
  },
  {
    id: 11,
    idcalendar: 3,
    title: "Walking Lunges",
    notes: "4 sets x 12 reps mỗi chân, phát triển đùi và mông.",
  },
  {
    id: 12,
    idcalendar: 3,
    title: "Sumo Squat",
    notes: "4 sets x 12 reps, tập trung vào đùi trong và mông.",
  },

  // idcalendar 4 - Bụng
  {
    id: 13,
    idcalendar: 4,
    title: "Plank",
    notes: "Hold 4 sets x 30-60 giây, tăng sức bền cơ bụng và core.",
  },
  {
    id: 14,
    idcalendar: 4,
    title: "Russian Twists",
    notes: "4 sets x 20 reps mỗi bên, tập trung vào cơ bụng xiên.",
  },
  {
    id: 15,
    idcalendar: 4,
    title: "Hanging Leg Raises",
    notes: "4 sets x 12 reps, phát triển cơ bụng dưới.",
  },
  {
    id: 16,
    idcalendar: 4,
    title: "Bicycle Crunches",
    notes: "4 sets x 20 reps mỗi bên, tăng cường cơ bụng toàn diện.",
  },

  // idcalendar 5 - Lưng
  {
    id: 17,
    idcalendar: 5,
    title: "Lat Pulldown",
    notes: "4 sets x 12 reps, tập trung phát triển cơ lưng rộng.",
  },
  {
    id: 18,
    idcalendar: 5,
    title: "Seated Row",
    notes: "4 sets x 12 reps, tập trung cơ lưng giữa.",
  },
  {
    id: 19,
    idcalendar: 5,
    title: "Pull-ups",
    notes: "4 sets x 8-10 reps, bài tập bodyweight cho lưng và tay.",
  },
  {
    id: 20,
    idcalendar: 5,
    title: "Face Pulls",
    notes: "4 sets x 15 reps, tập trung cơ lưng trên và vai sau.",
  },

  // idcalendar 6 - Vai
  {
    id: 21,
    idcalendar: 6,
    title: "Shoulder Press",
    notes: "4 sets x 12 reps, tập trung phát triển cơ vai trước.",
  },
  {
    id: 22,
    idcalendar: 6,
    title: "Lateral Raise",
    notes: "4 sets x 15 reps, tập trung cơ vai giữa.",
  },
  {
    id: 23,
    idcalendar: 6,
    title: "Front Raise",
    notes: "4 sets x 15 reps, tập trung cơ vai trước.",
  },
  {
    id: 24,
    idcalendar: 6,
    title: "Arnold Press",
    notes: "4 sets x 12 reps, hỗ trợ toàn bộ cơ vai.",
  },

  // idcalendar 7 - Tay trước
  {
    id: 25,
    idcalendar: 7,
    title: "Bicep Curl",
    notes: "4 sets x 12 reps, tập trung phát triển cơ tay trước.",
  },
  {
    id: 26,
    idcalendar: 7,
    title: "Hammer Curl",
    notes: "4 sets x 12 reps, hỗ trợ phát triển cánh tay trước.",
  },
  {
    id: 27,
    idcalendar: 7,
    title: "Concentration Curl",
    notes: "4 sets x 12 reps, tập trung cơ tay trước tối ưu.",
  },
  {
    id: 28,
    idcalendar: 7,
    title: "Cable Curl",
    notes: "4 sets x 15 reps, sử dụng máy cáp để tăng sức bền.",
  },

  // idcalendar 8 - Tay sau
  {
    id: 29,
    idcalendar: 8,
    title: "Tricep Dips",
    notes: "4 sets x 12 reps, tập trung cơ tay sau.",
  },
  {
    id: 30,
    idcalendar: 8,
    title: "Overhead Tricep Extension",
    notes: "4 sets x 12 reps, tập trung phát triển tay sau hiệu quả.",
  },
  {
    id: 31,
    idcalendar: 8,
    title: "Tricep Pushdown",
    notes: "4 sets x 12-15 reps, sử dụng máy cáp.",
  },
  {
    id: 32,
    idcalendar: 8,
    title: "Close-grip Bench Press",
    notes: "4 sets x 12 reps, bài tập đa năng cho tay sau.",
  },

  // idcalendar 9 - Cardio
  {
    id: 33,
    idcalendar: 9,
    title: "Running on Treadmill",
    notes: "4 sets x 10 phút, tăng sức bền và đốt mỡ.",
  },
  {
    id: 34,
    idcalendar: 9,
    title: "Cycling",
    notes: "4 sets x 10 phút, tập trung vào tim mạch và chân.",
  },
  {
    id: 35,
    idcalendar: 9,
    title: "Rowing Machine",
    notes: "4 sets x 8 phút, kết hợp cardio và lưng.",
  },
  {
    id: 36,
    idcalendar: 9,
    title: "Jump Rope",
    notes: "4 sets x 2 phút, cardio nhanh và hiệu quả.",
  },
  // idcalendar 10 - Cardio
  {
    id: 37,
    idcalendar: 10,
    title: "Running on Treadmill",
    notes: "4 sets x 10 phút, tăng sức bền và đốt mỡ.",
  },
  {
    id: 38,
    idcalendar: 10,
    title: "Cycling",
    notes: "4 sets x 10 phút, tập trung vào tim mạch và chân.",
  },
  {
    id: 39,
    idcalendar: 10,
    title: "Rowing Machine",
    notes: "4 sets x 8 phút, kết hợp cardio và lưng.",
  },
  {
    id: 40,
    idcalendar: 10,
    title: "Jump Rope",
    notes: "4 sets x 2 phút, cardio nhanh và hiệu quả.",
  },
];
export const memberShips=[
  {
    id:1,
    title:"PT kèm 1-1",
    tiers:["FIRE-PLUS","FIRE-VIP"]
  },
  {
    id:2,
    title:"Tự do tập luyện tại tất cả câu lạc bộ trong hệ thống",
    tiers:["FIRE","FIRE-PLUS","FIRE-VIP"]
  },
  {
    id:3,
    title:"Không giới hạn thời gian luyện tập",
    tiers:["FIRE","FIRE-PLUS","FIRE-VIP"]
  },
  {
    id:4,
    title:"Tham gia tất cả các lớp: Yoga, Zumba, HIIT, Pilates....",
    tiers:["FIRE-PLUS","FIRE-VIP"]
  },
  {
    id:5,
    title:"Nước uống miễn phí",
    tiers:["FIRE","FIRE-PLUS","FIRE-VIP"]
  },
  {
    id:6,
    title:"Khăn tập thể thao cao cấp.",
    tiers:["FIRE-PLUS","FIRE-VIP"]
  },
  {
    id:7,
    title:"Chuyển nhượng gói",
    tiers:["FIRE-VIP"]
  },
  {
    id:8,
    title:"Khu vực tập VIP",
    tiers:["FIRE-VIP"]
  },
]
export const registerClasses=[
  {
    FIRE:{
      id:1,
      costday:45000,
    },
    FIREPLUS:{
      id:1,
      costday:150000,
    },
    FIREVIP:{
      id:1,
      costday:500000,
    }
  }
]
export const nutritionData = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    trainerId:1,
    nutritionGoal: "Giảm cân",
    caloricNeeds: 1800,
    waterIntake: "2.5L",
    startDate: "2025-02-18",
    nutritionPlanName: "Low-carb",
    notes: "Dị ứng hải sản",
  },
  {
    id: 2,
    customerName: "Trần Thị C",
    trainerId:2,
    nutritionGoal: "Tăng cơ",
    caloricNeeds: 2500,
    waterIntake: "3L",
    startDate: "2025-02-15",
    nutritionPlanName: "Thiết kế riêng",
    notes: "Tiền sử bệnh tim",
  },
  {
    id: 3,
    customerName: "Phạm Văn E",
    trainerId:3,
    nutritionGoal: "Duy trì sức khỏe",
    caloricNeeds: 2000,
    waterIntake: "2L",
    startDate: "2025-02-10",
    nutritionPlanName: "",
    notes: "",
  },
];
// id: ID duy nhất cho từng sản phẩm.
// label: Tên sản phẩm.
// category: Danh mục sản phẩm (Supplement, Accessories, Equipment, v.v.).
// price: Giá sản phẩm (đơn vị VND).
// description: Mô tả ngắn gọn về sản phẩm.
// href: Đường dẫn URL đến trang chi tiết sản phẩm.
// inStock: Trạng thái còn hàng (true: còn hàng, false: hết hàng).
// imageUrl: Đường dẫn đến hình ảnh của sản phẩm.

export const productsdata = [
  {
    id: 1,
    label: "WHEY Protein",
    category: "Supplement",
    price: 599000,
    description: "Bột WHEY Protein chất lượng cao, hỗ trợ tăng cơ và phục hồi nhanh chóng sau khi tập.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/whey-protein.jpg",
  },
  {
    id: 2,
    label: "Yoga Mat",
    category: "Accessories",
    price: 199000,
    description: "Thảm tập yoga chống trượt, độ bền cao, thích hợp cho mọi bài tập yoga và pilates.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/yoga-mat.jpg",
  },
  {
    id: 3,
    label: "Resistance Bands",
    category: "Accessories",
    price: 150000, 
    description: "Bộ dây kháng lực chất lượng cao, giúp cải thiện cơ bắp và độ linh hoạt.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/resistance-bands.jpg",
  },
  {
    id: 4,
    label: "Pre-Workout Supplement",
    category: "Supplement",
    price: 450000, 
    description: "Thực phẩm bổ sung năng lượng trước khi tập, giúp bạn đạt hiệu suất tối đa.",
    href: "/",
    inStock: false,
    imageUrl: "/images/products/pre-workout.jpg",
  },
  {
    id: 5,
    label: "Dumbbells Set",
    category: "Equipment",
    price: 1200000, 
    description: "Bộ tạ tay 10kg (2 x 5kg), phù hợp cho các bài tập tại nhà và phòng gym.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/dumbbells-set.jpg",
  },
  {
    id: 6,
    label: "Foam Roller",
    category: "Accessories",
    price: 250000, 
    description: "Con lăn massage cơ bắp, hỗ trợ giảm căng cơ và phục hồi sau khi tập luyện.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/foam-roller.jpg",
  },
  {
    id: 7,
    label: "Gym Gloves",
    category: "Accessories",
    price: 100000, 
    description: "Găng tay tập gym chống trơn trượt, bảo vệ tay khi nâng tạ.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/gym-gloves.jpg",
  },
  {
    id: 8,
    label: "BCAA Powder",
    category: "Supplement",
    price: 550000, 
    description: "BCAA hỗ trợ giảm đau cơ và phục hồi cơ bắp nhanh chóng.",
    href: "/",
    inStock: false,
    imageUrl: "/images/products/bcaa-powder.jpg",
  },
  {
    id: 9,
    label: "Treadmill",
    category: "Equipment",
    price: 10000000, 
    description: "Máy chạy bộ cao cấp, nhiều chế độ tập luyện cho gia đình và phòng gym.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/treadmill.jpg",
  },
  {
    id: 10,
    label: "Protein Shaker Bottle",
    category: "Accessories",
    price: 99000, 
    description: "Bình lắc pha protein tiện dụng, dung tích 700ml.",
    href: "/",
    inStock: true,
    imageUrl: "/images/products/shaker-bottle.jpg",
  },
];


export const cartItems = [
  {
    id: 1,
    name: "Sữa Dalatmilk 1L",
    category: ["Có đường", "Không đường"],
    price: 35000,
    imageUrl: "/images/cart/dalatmilk-1l.jpg",
  },
  {
    id: 2,
    name: "Bánh khoai lang tím",
    category: ["Nhân đậu xanh", "Nhân phô mai"],
    price: 25000,
    imageUrl: "/images/cart/khoai-lang-tim.jpg",
  },
  {
    id: 3,
    name: "Snack trái cây sấy Sprout",
    category: ["Táo", "Chuối", "Dâu"],
    price: 45000,
    imageUrl: "/images/cart/sprout-snack.jpg",
  },
  {
    id: 4,
    name: "Hạt đậu khô Green One",
    category: ["Đậu nành", "Đậu đỏ", "Đậu xanh"],
    price: 60000,
    imageUrl: "/images/cart/green-one-beans.jpg",
  },
  {
    id: 5,
    name: "Sữa hạt dinh dưỡng",
    category: ["Hạnh nhân", "Óc chó", "Hạt điều"],
    price: 55000,
    imageUrl: "/images/cart/nut-milk.jpg",
  },
  {
    id: 6,
    name: "Bột Whey Protein",
    category: ["Vani", "Chocolate", "Dâu"],
    price: 599000,
    imageUrl: "/images/cart/whey-protein.jpg",
  },
  {
    id: 7,
    name: "Thảm tập Yoga",
    category: ["Xanh dương", "Hồng", "Tím"],
    price: 199000,
    imageUrl: "/images/cart/yoga-mat.jpg",
  },
  {
    id: 8,
    name: "Dây kháng lực",
    category: ["Nhẹ", "Trung bình", "Nặng"],
    price: 150000,
    imageUrl: "/images/cart/resistance-bands.jpg",
  },
  {
    id: 9,
    name: "Bộ tạ tay 10kg",
    category: ["2 x 5kg", "2 x 10kg"],
    price: 1200000,
    imageUrl: "/images/cart/dumbbells.jpg",
  },
  {
    id: 10,
    name: "Áo tập gym nam",
    category: ["S", "M", "L", "XL"],
    price: 299000,
    imageUrl: "/images/cart/gym-shirt.jpg",
  },
];

export const menu = [
  {
    id: 1,
    name: "Tăng cơ",
    schedule: [
      {
        day: "Thứ Hai",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì với trứng và bơ đậu phộng" },
          { name: "Bữa xế", food: "Sữa chua với hạt chia" },
          { name: "Bữa trưa", food: "Cơm gà xé với rau củ" },
          { name: "Bữa xế chiều", food: "Sinh tố protein" },
          { name: "Bữa tối", food: "Cá hồi nướng với khoai tây" },
        ],
      },
      {
        day: "Thứ Ba",
        meals: [
          { name: "Bữa sáng", food: "Mì Ý với thịt bò bằm" },
          { name: "Bữa xế", food: "Hạt điều" },
          { name: "Bữa trưa", food: "Cơm tấm sườn nướng" },
          { name: "Bữa xế chiều", food: "Trái cây tươi" },
          { name: "Bữa tối", food: "Gà nướng với khoai lang" },
        ],
      },
      {
        day: "Thứ Tư",
        meals: [
          { name: "Bữa sáng", food: "Bột yến mạch với quả mọng" },
          { name: "Bữa xế", food: "Sữa đậu nành" },
          { name: "Bữa trưa", food: "Salad quinoa với đậu" },
          { name: "Bữa xế chiều", food: "Bánh mì nướng với bơ" },
          { name: "Bữa tối", food: "Thịt lợn nướng với rau củ" },
        ],
      },
      {
        day: "Thứ Năm",
        meals: [
          { name: "Bữa sáng", food: "Trứng ốp la với rau bina" },
          { name: "Bữa xế", food: "Sinh tố chuối" },
          { name: "Bữa trưa", food: "Cơm chiên với tôm" },
          { name: "Bữa xế chiều", food: "Hạt hướng dương" },
          { name: "Bữa tối", food: "Cá chiên với salad" },
        ],
      },
      {
        day: "Thứ Sáu",
        meals: [
          { name: "Bữa sáng", food: "Bánh pancake protein" },
          { name: "Bữa xế", food: "Yogurt với mật ong" },
          { name: "Bữa trưa", food: "Gà xào với nấm" },
          { name: "Bữa xế chiều", food: "Trái cây khô" },
          { name: "Bữa tối", food: "Bò bít tết với khoai tây" },
        ],
      },
      {
        day: "Thứ Bảy",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì kẹp trứng" },
          { name: "Bữa xế", food: "Sữa hạt" },
          { name: "Bữa trưa", food: "Salad gà nướng" },
          { name: "Bữa xế chiều", food: "Bánh quy protein" },
          { name: "Bữa tối", food: "Gà rang muối" },
        ],
      },
      {
        day: "Chủ Nhật",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì nướng với bơ và chuối" },
          { name: "Bữa xế", food: "Hạt óc chó" },
          { name: "Bữa trưa", food: "Cơm gà với rau xanh" },
          { name: "Bữa xế chiều", food: "Trà xanh" },
          { name: "Bữa tối", food: "Tôm hấp với rau củ" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Giảm cân",
    schedule: [
      {
        day: "Thứ Hai",
        meals: [
          { name: "Bữa sáng", food: "Trái cây tươi và ngũ cốc" },
          { name: "Bữa xế", food: "Hạt hạnh nhân" },
          { name: "Bữa trưa", food: "Salad gà" },
          { name: "Bữa xế chiều", food: "Trà xanh" },
          { name: "Bữa tối", food: "Thịt bò xào với bông cải xanh" },
        ],
      },
      {
        day: "Thứ Ba",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì nguyên cám với trứng" },
          { name: "Bữa xế", food: "Sinh tố rau xanh" },
          { name: "Bữa trưa", food: "Cơm gạo lứt với cá" },
          { name: "Bữa xế chiều", food: "Trái cây tươi" },
          { name: "Bữa tối", food: "Gà xào rau củ" },
        ],
      },
      {
        day: "Thứ Tư",
        meals: [
          { name: "Bữa sáng", food: "Bột yến mạch không đường" },
          { name: "Bữa xế", food: "Hạt chia" },
          { name: "Bữa trưa", food: "Salad quinoa" },
          { name: "Bữa xế chiều", food: "Trà thảo mộc" },
          { name: "Bữa tối", food: "Súp rau củ" },
        ],
      },
      {
        day: "Thứ Năm",
        meals: [
          { name: "Bữa sáng", food: "Trái cây tươi" },
          { name: "Bữa xế", food: "Hạt hướng dương" },
          { name: "Bữa trưa", food: "Cơm gạo lứt với đậu phụ" },
          { name: "Bữa xế chiều", food: "Sữa đậu nành" },
          { name: "Bữa tối", food: "Cá nướng với rau" },
        ],
      },
      {
        day: "Thứ Sáu",
        meals: [
          { name: "Bữa sáng", food: "Bánh pancake yến mạch" },
          { name: "Bữa xế", food: "Sữa chua không đường" },
          { name: "Bữa trưa", food: "Salad gà nướng" },
          { name: "Bữa xế chiều", food: "Trái cây khô" },
          { name: "Bữa tối", food: "Thịt bò nướng với rau" },
        ],
      },
      {
        day: "Thứ Bảy",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì kẹp rau" },
          { name: "Bữa xế", food: "Trà xanh" },
          { name: "Bữa trưa", food: "Cơm cuộn rau củ" },
          { name: "Bữa xế chiều", food: "Hạt hạnh nhân" },
          { name: "Bữa tối", food: "Gà hấp với bông cải" },
        ],
      },
      {
        day: "Chủ Nhật",
        meals: [
          { name: "Bữa sáng", food: "Sữa chua với trái cây" },
          { name: "Bữa xế", food: "Hạt chia" },
          { name: "Bữa trưa", food: "Cơm gạo lứt với cá hồi" },
          { name: "Bữa xế chiều", food: "Trà thảo mộc" },
          { name: "Bữa tối", food: "Súp bắp cải" },
        ],
      },
    ],
  },
  {
    id: 33,
    name: "Giảm mỡ",
    schedule: [
      {
        day: "Thứ Hai",
        meals: [
          { name: "Bữa sáng", food: "Trái cây tươi và ngũ cốc" },
          { name: "Bữa xế", food: "Hạt hạnh nhân" },
          { name: "Bữa trưa", food: "Salad gà" },
          { name: "Bữa xế chiều", food: "Trà xanh" },
          { name: "Bữa tối", food: "Thịt bò xào với bông cải xanh" },
        ],
      },
      {
        day: "Thứ Ba",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì nguyên cám với trứng" },
          { name: "Bữa xế", food: "Sinh tố rau xanh" },
          { name: "Bữa trưa", food: "Cơm gạo lứt với cá" },
          { name: "Bữa xế chiều", food: "Trái cây tươi" },
          { name: "Bữa tối", food: "Gà xào rau củ" },
        ],
      },
      {
        day: "Thứ Tư",
        meals: [
          { name: "Bữa sáng", food: "Bột yến mạch không đường" },
          { name: "Bữa xế", food: "Hạt chia" },
          { name: "Bữa trưa", food: "Salad quinoa" },
          { name: "Bữa xế chiều", food: "Trà thảo mộc" },
          { name: "Bữa tối", food: "Súp rau củ" },
        ],
      },
      {
        day: "Thứ Năm",
        meals: [
          { name: "Bữa sáng", food: "Trái cây tươi" },
          { name: "Bữa xế", food: "Hạt hướng dương" },
          { name: "Bữa trưa", food: "Cơm gạo lứt với đậu phụ" },
          { name: "Bữa xế chiều", food: "Sữa đậu nành" },
          { name: "Bữa tối", food: "Cá nướng với rau" },
        ],
      },
      {
        day: "Thứ Sáu",
        meals: [
          { name: "Bữa sáng", food: "Bánh pancake yến mạch" },
          { name: "Bữa xế", food: "Sữa chua không đường" },
          { name: "Bữa trưa", food: "Salad gà nướng" },
          { name: "Bữa xế chiều", food: "Trái cây khô" },
          { name: "Bữa tối", food: "Thịt bò nướng với rau" },
        ],
      },
      {
        day: "Thứ Bảy",
        meals: [
          { name: "Bữa sáng", food: "Bánh mì kẹp rau" },
          { name: "Bữa xế", food: "Trà xanh" },
          { name: "Bữa trưa", food: "Cơm cuộn rau củ" },
          { name: "Bữa xế chiều", food: "Hạt hạnh nhân" },
          { name: "Bữa tối", food: "Gà hấp với bông cải" },
        ],
      },
      {
        day: "Chủ Nhật",
        meals: [
          { name: "Bữa sáng", food: "Sữa chua với trái cây" },
          { name: "Bữa xế", food: "Hạt chia" },
          { name: "Bữa trưa", food: "Cơm gạo lứt với cá hồi" },
          { name: "Bữa xế chiều", food: "Trà thảo mộc" },
          { name: "Bữa tối", food: "Súp bắp cải" },
        ],
      },
    ],
  },
  {
      id: 4,
      name: "Độ Mông",
      schedule: [
        {
          day: "Thứ Hai",
          meals: [
            { name: "Bữa sáng", food: "Trái cây tươi và ngũ cốc" },
            { name: "Bữa xế", food: "Hạt hạnh nhân" },
            { name: "Bữa trưa", food: "Salad gà" },
            { name: "Bữa xế chiều", food: "Trà xanh" },
            { name: "Bữa tối", food: "Thịt bò xào với bông cải xanh" },
          ],
        },
        {
          day: "Thứ Ba",
          meals: [
            { name: "Bữa sáng", food: "Bánh mì nguyên cám với trứng" },
            { name: "Bữa xế", food: "Sinh tố rau xanh" },
            { name: "Bữa trưa", food: "Cơm gạo lứt với cá" },
            { name: "Bữa xế chiều", food: "Trái cây tươi" },
            { name: "Bữa tối", food: "Gà xào rau củ" },
          ],
        },
        {
          day: "Thứ Tư",
          meals: [
            { name: "Bữa sáng", food: "Bột yến mạch không đường" },
            { name: "Bữa xế", food: "Hạt chia" },
            { name: "Bữa trưa", food: "Salad quinoa" },
            { name: "Bữa xế chiều", food: "Trà thảo mộc" },
            { name: "Bữa tối", food: "Súp rau củ" },
          ],
        },
        {
          day: "Thứ Năm",
          meals: [
            { name: "Bữa sáng", food: "Trái cây tươi" },
            { name: "Bữa xế", food: "Hạt hướng dương" },
            { name: "Bữa trưa", food: "Cơm gạo lứt với đậu phụ" },
            { name: "Bữa xế chiều", food: "Sữa đậu nành" },
            { name: "Bữa tối", food: "Cá nướng với rau" },
          ],
        },
        {
          day: "Thứ Sáu",
          meals: [
            { name: "Bữa sáng", food: "Bánh pancake yến mạch" },
            { name: "Bữa xế", food: "Sữa chua không đường" },
            { name: "Bữa trưa", food: "Salad gà nướng" },
            { name: "Bữa xế chiều", food: "Trái cây khô" },
            { name: "Bữa tối", food: "Thịt bò nướng với rau" },
          ],
        },
        {
          day: "Thứ Bảy",
          meals: [
            { name: "Bữa sáng", food: "Bánh mì kẹp rau" },
            { name: "Bữa xế", food: "Trà xanh" },
            { name: "Bữa trưa", food: "Cơm cuộn rau củ" },
            { name: "Bữa xế chiều", food: "Hạt hạnh nhân" },
            { name: "Bữa tối", food: "Gà hấp với bông cải" },
          ],
        },
        {
          day: "Chủ Nhật",
          meals: [
            { name: "Bữa sáng", food: "Sữa chua với trái cây" },
            { name: "Bữa xế", food: "Hạt chia" },
            { name: "Bữa trưa", food: "Cơm gạo lứt với cá hồi" },
            { name: "Bữa xế chiều", food: "Trà thảo mộc" },
            { name: "Bữa tối", food: "Súp bắp cải" },
          ],
        },
      ],
    },
];

export const trainingPlans = [
  {
    id: 1,
    name: "Giảm cân (Weight Loss Program)",
    goal: "Giảm mỡ, cải thiện sức khỏe tim mạch, tăng cường năng lượng.",
    duration: 12,
    details: [
      { week: "Tuần 1-4", description: "Cardio kết hợp tập tạ nhẹ (3-4 buổi/tuần)." },
      { week: "Tuần 5-8", description: "Tăng cường cường độ HIIT và bài tập toàn thân." },
      { week: "Tuần 9-12", description: "Xen kẽ cardio, bài tập sức mạnh và tăng khối lượng tạ." }
    ]
  },
  {
    id: 2,
    name: "Tăng cơ (Muscle Building Program)",
    goal: "Tăng khối lượng cơ, cải thiện sức mạnh.",
    duration: 16,
    details: [
      { week: "Tuần 1-4", description: "Tập toàn thân, nhấn mạnh vào các bài compound." },
      { week: "Tuần 5-8", description: "Tăng khối lượng tạ và chia nhỏ nhóm cơ (push/pull/legs)." },
      { week: "Tuần 9-16", description: "Chuyên sâu từng nhóm cơ, tăng cường bài tập isolation." }
    ]
  }
];

export const trainerdata = [
  {
    id:1,
    idAccount:1,
    name:"Tam",
    averageRating: 4.8,
  },
  {
    id:2,
    idAccount:2,
    name:"Thanh Tam",
    averageRating: 4,
  },
  {
    id:3,
    idAccount:3,
    name:"Phan Thanh Tam",
    averageRating: 4.9,
  },
  {
    id:4,
    idAccount:4,
    name:"Le Phan Thanh Tam",
    averageRating: 4.5,
  }
];

export const bodyCompositionData = [
  {
    id:1,
    idAccount:1,
    weight: 70, // Cân nặng (kg)
    bodyFatPercentage: 20.5, // Tỷ lệ mỡ cơ thể (%)
    minerals: 4.2, // Mối vô cơ (kg)
    protein: 12.8, // Lượng protein (kg)
    bodyWater: 40.5, // Nước trong cơ thể (kg)
    muscleMass: 30.2, // Cơ bắp (kg)
    skeletalMuscle: 25.4, // Cơ xương (kg)
    bodyFatMass: 14.3, // Khối lượng chất béo (kg)
  },
  {
    id:2,
    idAccount:2,
    weight: 50, // Cân nặng (kg)
    bodyFatPercentage: 20.5, // Tỷ lệ mỡ cơ thể (%)
    minerals: 4.2, // Mối vô cơ (kg)
    protein: 12.8, // Lượng protein (kg)
    bodyWater: 40.5, // Nước trong cơ thể (kg)
    muscleMass: 30.2, // Cơ bắp (kg)
    skeletalMuscle: 25.4, // Cơ xương (kg)
    bodyFatMass: 14.3, // Khối lượng chất béo (kg)
  },
];
export const WeightControldata=[
    {
      id: 1,
      idAccount: 1,
      weight: 65,
      targetWeight: 60,
      weightControl: -5,
      fatControl: -3,
      muscleControl: 2,
    },
    {
      id: 2,
      idAccount: 2,
      weight: 75,
      targetWeight: 70,
      weightControl: -5,
      fatControl: -4,
      muscleControl: 1,
    },
    {
      id: 3,
      idAccount: 3,
      weight: 55,
      targetWeight: 58,
      weightControl: 3,
      fatControl: 1,
      muscleControl: 2,
    },
    {
      id: 4,
      idAccount: 4,
      weight: 80,
      targetWeight: 75,
      weightControl: -5,
      fatControl: -3,
      muscleControl: -2,
    },
    {
      id: 5,
      idAccount: 5,
      weight: 68,
      targetWeight: 65,
      weightControl: -3,
      fatControl: -2,
      muscleControl: -1,
    },
  ];

