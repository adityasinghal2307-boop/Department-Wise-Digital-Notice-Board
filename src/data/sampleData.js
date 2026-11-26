export const DEPARTMENTS = [
  {
    id: 'CSE',
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    block: 'Block A — Computing Wing',
    hod: 'Dr. Ananya Sharma',
    accent: '#2563EB',
  },
  {
    id: 'CSE (AI & ML)',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    shortName: 'CSE (AI & ML)',
    block: 'Block A — AI Research Lab',
    hod: 'Dr. Vikramaditya Rao',
    accent: '#0284C7',
  },
  {
    id: 'IT',
    name: 'Information Technology',
    shortName: 'IT',
    block: 'Block B — Tech Center',
    hod: 'Prof. Meera Deshmukh',
    accent: '#4F46E5',
  },
  {
    id: 'ECE',
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    block: 'Block C — VLSI & Signal Wing',
    hod: 'Dr. Rajesh Kulkarni',
    accent: '#0D9488',
  },
  {
    id: 'ME',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    block: 'Block D — CAD/CAM Workshop',
    hod: 'Prof. Suresh Nair',
    accent: '#D97706',
  },
  {
    id: 'CE',
    name: 'Civil Engineering',
    shortName: 'CE',
    block: 'Block E — Structural Wing',
    hod: 'Dr. Kavita Iyer',
    accent: '#059669',
  },
  {
    id: 'EE',
    name: 'Electrical Engineering',
    shortName: 'EE',
    block: 'Block F — Power Systems Lab',
    hod: 'Dr. Arvind Verma',
    accent: '#7C3AED',
  },
];

export const CATEGORIES = [
  'Examination',
  'Events',
  'Holidays',
  'Placements',
  'Workshops',
  'General Announcements',
];

export const PRIORITIES = ['High', 'Medium', 'Normal'];

const getRelativeIso = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const getRelativeDateStr = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const createInitialNotices = () => [
  {
    id: 'notice-1001',
    title: 'End-Semester Theory Examination Timetable Released (Odd Semester)',
    description:
      'The final theory examination schedule for 3rd, 5th, and 7th semester B.Tech CSE students has been published. Students must verify their subject codes and seating block on the examination portal. Hall tickets will be issued by the department coordinator starting next Monday. Carry your valid College ID card to all examination halls.',
    department: 'CSE',
    category: 'Examination',
    priority: 'High',
    status: 'Published',
    postedBy: 'Controller of Examinations',
    publishedAt: getRelativeIso(-1),
    expiryDate: getRelativeDateStr(20),
    updatedAt: getRelativeIso(-1),
  },
  {
    id: 'notice-1002',
    title: 'Campus Placement Drive: NovaTech AI & Cloud Systems (2027 Batch)',
    description:
      'NovaTech AI & Cloud Systems is conducting an on-campus recruitment drive for B.Tech CSE (AI & ML) and CSE final-year students for the role of Associate ML Engineer (CTC: 12.5 LPA). Eligible candidates with CGPA 7.5+ and zero active backlogs must register via the Training & Placement portal before the deadline. Pre-placement talk starts at 9:30 AM in the Main Auditorium.',
    department: 'CSE (AI & ML)',
    category: 'Placements',
    priority: 'High',
    status: 'Published',
    postedBy: 'Training & Placement Cell',
    publishedAt: getRelativeIso(-2),
    expiryDate: getRelativeDateStr(12),
    updatedAt: getRelativeIso(-2),
  },
  {
    id: 'notice-1003',
    title: '2-Day Hands-On Workshop on Cloud Native DevOps & Docker',
    description:
      'The Department of Information Technology in collaboration with the CSI Student Chapter is organizing an intensive two-day practical workshop on containerization, CI/CD pipelines, and Kubernetes fundamentals. Laptops with at least 8 GB RAM are mandatory. E-certificates will be awarded upon successful completion of the mini deployment lab.',
    department: 'IT',
    category: 'Workshops',
    priority: 'Medium',
    status: 'Published',
    postedBy: 'Prof. Meera Deshmukh (HOD, IT)',
    publishedAt: getRelativeIso(-3),
    expiryDate: getRelativeDateStr(15),
    updatedAt: getRelativeIso(-3),
  },
  {
    id: 'notice-1004',
    title: 'National Symposium on VLSI Design & Embedded IoT Systems',
    description:
      'ECE department invites student research papers and hardware prototypes for ElectroFest 2026. Selected teams will present their FPGA and IoT projects before industry experts from semiconductor firms. Registration is free for internal students; submit abstracts at the ECE Seminar Hall desk.',
    department: 'ECE',
    category: 'Events',
    priority: 'Medium',
    status: 'Published',
    postedBy: 'ECE Technical Society',
    publishedAt: getRelativeIso(-4),
    expiryDate: getRelativeDateStr(18),
    updatedAt: getRelativeIso(-4),
  },
  {
    id: 'notice-1005',
    title: 'Mandatory Lab Safety & CNC Machine Calibration Schedule',
    description:
      'All 2nd and 3rd year Mechanical Engineering students attending the Manufacturing Technology Lab must wear steel-toe safety shoes and lab aprons starting this week. Batch B2 lab hours on Thursday are shifted from 2:00 PM to 10:00 AM due to routine CNC calibration.',
    department: 'ME',
    category: 'General Announcements',
    priority: 'Normal',
    status: 'Published',
    postedBy: 'Workshop Superintendent, ME',
    publishedAt: getRelativeIso(-5),
    expiryDate: getRelativeDateStr(25),
    updatedAt: getRelativeIso(-5),
  },
  {
    id: 'notice-1006',
    title: 'Winter Break & Academic Holiday Notification',
    description:
      'In accordance with the academic calendar, all Civil Engineering theory classes and regular lab sessions will remain suspended during the upcoming winter festival holiday window. Central Library reading rooms will remain open from 9:00 AM to 5:00 PM for project and competitive exam preparation.',
    department: 'CE',
    category: 'Holidays',
    priority: 'Normal',
    status: 'Published',
    postedBy: 'Office of the Dean (Academics)',
    publishedAt: getRelativeIso(-6),
    expiryDate: getRelativeDateStr(30),
    updatedAt: getRelativeIso(-6),
  },
  {
    id: 'notice-1007',
    title: 'Industrial Visit to 400kV National Grid Substation — Consent Form',
    description:
      'An educational industrial visit to the 400kV Regional Power Substation is scheduled for 5th semester Electrical Engineering students. Interested students must submit the signed parental consent form and copy of their college ID to the EE department office by 4:00 PM this Friday.',
    department: 'EE',
    category: 'Events',
    priority: 'Medium',
    status: 'Published',
    postedBy: 'Dr. Arvind Verma (HOD, EE)',
    publishedAt: getRelativeIso(-7),
    expiryDate: getRelativeDateStr(10),
    updatedAt: getRelativeIso(-7),
  },
  {
    id: 'notice-1008',
    title: 'Internal Practical Viva & Mini-Project Review Rubrics',
    description:
      'CSE 5th semester students are informed that internal mini-project evaluations will assess system architecture, UI responsiveness, documentation quality, and live feature demonstration. Teams of 2–3 must bring bound project reports and runnable source code.',
    department: 'CSE',
    category: 'Examination',
    priority: 'High',
    status: 'Published',
    postedBy: 'Dr. Ananya Sharma (HOD, CSE)',
    publishedAt: getRelativeIso(0),
    expiryDate: getRelativeDateStr(14),
    updatedAt: getRelativeIso(0),
  },
  {
    id: 'notice-1009',
    title: 'Generative AI Hackathon — Team Registration Closed (Archived)',
    description:
      'Registration for the inter-departmental Generative AI Hackathon held earlier this month has concluded. Shortlisted teams have already received confirmation emails with mentor allocations.',
    department: 'CSE (AI & ML)',
    category: 'Workshops',
    priority: 'Normal',
    status: 'Published',
    postedBy: 'AI & ML Innovation Cell',
    publishedAt: getRelativeIso(-25),
    expiryDate: getRelativeDateStr(-5),
    updatedAt: getRelativeIso(-25),
  },
  {
    id: 'notice-1010',
    title: 'Upcoming Alumni Tech Talk: Modern System Design (Draft)',
    description:
      'Draft notice for an upcoming weekend virtual session by 2019 IT alumni currently working as Senior Software Architects. Pending final confirmation of Zoom link and timing.',
    department: 'IT',
    category: 'Events',
    priority: 'Normal',
    status: 'Draft',
    postedBy: 'IT Alumni Relations',
    publishedAt: getRelativeIso(-1),
    expiryDate: getRelativeDateStr(22),
    updatedAt: getRelativeIso(-1),
  },
];

export const DEFAULT_SETTINGS = {
  role: 'admin',
  defaultDepartment: 'ALL',
  showExpiredInStudentView: false,
  collegeName: 'ABES Institute of Technology',
};
