// ==========================================
// ITAL AUTO HRMS - CORE JAVASCRIPT ENGINE
// ==========================================

// Safe Event Listener Helpers
function safeAddListener(id, event, callback) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener(event, callback);
  }
}

function safeAddListenersQueryAll(selector, event, callback) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => el.addEventListener(event, callback));
}

// Global state holding current session and loaded data
const state = {
  currentUser: null,
  activeSystem: null,  // 'travel' or 'leave'
  activeSection: null, // DOM element ID of active view
  users: {},
  travels: [],
  leaves: [],
  currentCalendarDate: new Date(2026, 5, 8), // Default to June 8, 2026
  activeCalendarMonth: 5, // June
  activeCalendarYear: 2026
};

// Initial Mock Data (used if LocalStorage is empty)
const DEFAULT_USERS = {

  // ── ED OFFICE ─────────────────────────────────────────────────────────────
  "Nick Syn": {
    id: "Nick Syn",
    name: "NICK SYN",
    role: "DIRECTOR",
    department: "ED OFFICE",
    isAdmin: true,
    isManagement: true,
    password: "Temporary password",
    passwordChanged: false,
    leaveBalances: { "ANNUAL LEAVE": 30, "SICK LEAVE": 15, "EMERGENCY LEAVE": 5 }
  },
  "IM023": {
    id: "IM023",
    name: "ZAHIR KELVIN ONG ABDULLAH",
    role: "EXECUTIVE DIRECTOR",
    department: "ED OFFICE",
    isAdmin: false,
    isManagement: true,
    password: "Temp@2026!",
    passwordChanged: false,
    leaveBalances: { "ANNUAL LEAVE": 30, "SICK LEAVE": 15, "EMERGENCY LEAVE": 5 }
  },
  "IM001": {
    id: "IM001",
    name: "WOO CHUN MING",
    role: "CHIEF OPERATING OFFICER",
    department: "ED OFFICE",
    isAdmin: false,
    isManagement: true,
    password: "Temp@2026!",
    passwordChanged: false,
    leaveBalances: { "ANNUAL LEAVE": 30, "SICK LEAVE": 15, "EMERGENCY LEAVE": 5 }
  },

  // ── PRESIDENT OFFICE ──────────────────────────────────────────────────────
  "IM045": {
    id: "IM045",
    name: "SAMSON ANAND GEORGE",
    role: "PRESIDENT",
    department: "PRESIDENT OFFICE",
    isAdmin: false,
    isManagement: true,
    password: "Temp@2026!",
    passwordChanged: false,
    leaveBalances: { "ANNUAL LEAVE": 30, "SICK LEAVE": 15, "EMERGENCY LEAVE": 5 }
  },

  // ── GENERAL MANAGER ───────────────────────────────────────────────────────
  "IM018": {
    id: "IM018",
    name: "SURAISH KUMAR A/L SUBRAMANIAM",
    role: "GENERAL MANAGER",
    department: "GENERAL MANAGER",
    isAdmin: true,
    isManagement: true,
    password: "Temp@2026!",
    passwordChanged: false,
    leaveBalances: { "ANNUAL LEAVE": 30, "SICK LEAVE": 15, "EMERGENCY LEAVE": 5 }
  },

  // ── HUMAN RESOURCE & ADMINISTRATION ───────────────────────────────────────
  "IM022": {
    id: "IM022",
    name: "NOR AZIMAH BINTI MUSTAFA",
    role: "MANAGER",
    department: "HUMAN RESOURCE & ADMINISTRATION",
    isAdmin: true,
    password: "Hr@2026",
    passwordChanged: true,
    leaveBalances: { "ANNUAL LEAVE": 18, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM030": {
    id: "IM030",
    name: "NUR FARAH HANEE BINTI ZAMARUDDIN",
    role: "EXECUTIVE",
    department: "HUMAN RESOURCE & ADMINISTRATION",
    isAdmin: true,
    password: "Hr@2026",
    passwordChanged: true,
    leaveBalances: { "ANNUAL LEAVE": 15, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },

  // ── GOVERNMENT LIAISON & LOGISTIC ─────────────────────────────────────────
  "IM026": {
    id: "IM026",
    name: "MOHD RAFAE BIN YUSOF",
    role: "HEAD OF GOVERNMENT LIAISON & LOGISTIC",
    department: "GOVERNMENT LIAISON & LOGISTIC",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 22, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM019": {
    id: "IM019",
    name: "FARINA SHAZLEEN BINTI MOHAMAD JAAFAR",
    role: "SENIOR EXECUTIVE",
    department: "GOVERNMENT LIAISON & LOGISTIC",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },

  // ── FINANCE ───────────────────────────────────────────────────────────────
  "IM050": {
    id: "IM050",
    name: "TAN JIN YUAN",
    role: "MANAGER",
    department: "FINANCE",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 18, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM032": {
    id: "IM032",
    name: "FATIN ADLINA BINTI MOHD NAZRI",
    role: "ASSISTANT MANAGER",
    department: "FINANCE",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 15, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM037": {
    id: "IM037",
    name: "SHAZLINA BINTI KAMARUL BAHRAIN",
    role: "EXECUTIVE",
    department: "FINANCE",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },

  // ── SALES ─────────────────────────────────────────────────────────────────
  "IM043": {
    id: "IM043",
    name: "NG MUN KHAI",
    role: "HEAD OF SALES",
    department: "SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 22, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM011": {
    id: "IM011",
    name: "SHARIFAH SYAFIYAH BINTI SYED HASHIM",
    role: "SENIOR EXECUTIVE, SALES OPERATIONS",
    department: "SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 11, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM048": {
    id: "IM048",
    name: "ELYSHA BINTI MUHAMMAD DERWIN",
    role: "FRONT DESK EXECUTIVE",
    department: "SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM010": {
    id: "IM010",
    name: "WINNIE LOCK WENG CHING",
    role: "SALES CONSULTANT",
    department: "SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM012": {
    id: "IM012",
    name: "NAZRUL KHAN BIN AHMAD KHAN",
    role: "SALES CONSULTANT",
    department: "SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM047": {
    id: "IM047",
    name: "AHMAD FERRARI BIN AHMAD FAUZI",
    role: "SALES CONSULTANT",
    department: "SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 23, "SICK LEAVE": 12, "EMERGENCY LEAVE": 4 },
    leaveStats: {
      "ANNUAL LEAVE": { full: 18, bf: 9, adjust: 0, forfeit: 0, entitle: 18, taken: 4 },
      "SICK LEAVE": { full: 14, bf: 0, adjust: 0, forfeit: 0, entitle: 14, taken: 2 },
      "EMERGENCY LEAVE": { full: 5, bf: 0, adjust: 0, forfeit: 0, entitle: 5, taken: 1 }
    }
  },

  // ── MARKETING & COMMUNICATIONS ────────────────────────────────────────────
  "IM036": {
    id: "IM036",
    name: "MUHAMMAD FARHAN BIN OTHMAN",
    role: "CORSE CLIENTI MANAGER",
    department: "MARKETING & COMMUNICATIONS",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 18, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM049": {
    id: "IM049",
    name: "STEFAN TAN TONG WEI",
    role: "MANAGER",
    department: "MARKETING & COMMUNICATIONS",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 18, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM006": {
    id: "IM006",
    name: "LIEW YEE CHING",
    role: "SENIOR EXECUTIVE",
    department: "MARKETING & COMMUNICATIONS",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 15, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },

  // ── AFTER SALES ───────────────────────────────────────────────────────────
  "IM005": {
    id: "IM005",
    name: "KOH SHU BOH",
    role: "HEAD OF AFTER SALES",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 22, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM009": {
    id: "IM009",
    name: "AZRUL HISYAM BIN RUSLIN",
    role: "ASSISTANT MANAGER, SERVICE",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 18, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM013": {
    id: "IM013",
    name: "PRADHEEP MANI A/L VELLA KUPPAN",
    role: "ASSISTANT SERVICE MANAGER",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "REPLACEMENT LEAVE": 10, "ANNUAL LEAVE": 12 }
  },
  "IM020": {
    id: "IM020",
    name: "NUR HASDYANNA BINTI HASNURASHID",
    role: "ASSISTANT MANAGER, WARRANTY",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 15, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM008": {
    id: "IM008",
    name: "SANKARAN A/L JAYARAMAN",
    role: "MASTER TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 8, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM028": {
    id: "IM028",
    name: "PRISSILLA JOYCE A/P PAUL RAMANAIDOO",
    role: "SENIOR EXECUTIVE",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 16, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM038": {
    id: "IM038",
    name: "RAVIKARAN A/L RAMUDU",
    role: "JOB CONTROLLER",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM039": {
    id: "IM039",
    name: "NOR NAJWA BINTI MOHD HAIZAR",
    role: "SERVICE ADVISOR",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 15, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM007": {
    id: "IM007",
    name: "HELMEY BIN HASSIM",
    role: "MASTER TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 13, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM014": {
    id: "IM014",
    name: "KWONG KENG FAI",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM015": {
    id: "IM015",
    name: "SAMUEL JOSEPH A/L SARJIT SINGH",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM016": {
    id: "IM016",
    name: "WONG LIANG JIN",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM017": {
    id: "IM017",
    name: "ISMIZULKHAIRI BIN ISMAIL",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM033": {
    id: "IM033",
    name: "TAN PI TER",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM034": {
    id: "IM034",
    name: "THIVANESWARAN A/L PANDIAN",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM035": {
    id: "IM035",
    name: "MUHAMMAD FAIZ BIN MOHAMAD ZIN",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM044": {
    id: "IM044",
    name: "MUHAMMAD AKMAL BIN AHMAD TAUFIK",
    role: "TECHNICIAN",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM025": {
    id: "IM025",
    name: "NURFARHANA BINTI ZAINAL",
    role: "ASSISTANT MANAGER, PARTS",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 16, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },
  "IM041": {
    id: "IM041",
    name: "MUHAMMAD EZRAL HAIKAL BIN RAZAK",
    role: "EXECUTIVE, PARTS",
    department: "AFTER SALES",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 14, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  },

  // ── SPECIAL PROJECT ───────────────────────────────────────────────────────
  "IM046": {
    id: "IM046",
    name: "MOHD MAHADI BIN YAACOB",
    role: "SPECIAL PROJECT",
    department: "SPECIAL PROJECT",
    isAdmin: false,
    leaveBalances: { "ANNUAL LEAVE": 12, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 }
  }
};

const DEFAULT_TRAVELS = [
  {
    id: "TW-1001",
    staffId: "IM043",
    staffName: "NG MUN KHAI",
    role: "HEAD OF SALES",
    destination: "Kuala Lumpur Convention Centre",
    purpose: "Annual Automotive Sales Conference",
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    transport: "Company Car",
    budget: 1800,
    notes: "Represent dealership at national sales conference.",
    status: "Approved",
    remarks: "Approved by HR Manager.",
    dateApplied: "2026-05-10",
    jobGrade: "Manager",
    divDept: "SALES",
    branch: "Ital Auto Kuala Lumpur",
    deptTime: "2026-05-20T08:00",
    deptDist: 35,
    arrTime: "2026-05-22T18:00",
    arrDist: 35,
    modes: ["Company Car"],
    lodgingRate: 350,
    lodgingDays: 2,
    lodgingTotal: 700,
    mileage: 0,
    fuel: 120,
    toll: 30,
    airfares: 0,
    subsistenceRate: 80,
    subsistenceDays: 2,
    subsistenceTotal: 160,
    entDetail: "",
    entTotal: 0,
    costTotal: 1010,
    advanceAmount: 500
  },
  {
    id: "TW-1002",
    staffId: "IM026",
    staffName: "MOHD RAFAE BIN YUSOF",
    role: "HEAD OF GOVERNMENT LIAISON & LOGISTIC",
    destination: "Putrajaya — JPJ & MITI Office",
    purpose: "Government Liaison Meeting",
    startDate: "2026-06-12",
    endDate: "2026-06-13",
    transport: "Company Car",
    budget: 600,
    notes: "Vehicle import permit renewal and compliance review.",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-05",
    jobGrade: "Executive / Specialist",
    divDept: "GOVERNMENT LIAISON & LOGISTIC",
    branch: "Ital Auto Kuala Lumpur",
    deptTime: "2026-06-12T07:30",
    deptDist: 55,
    arrTime: "2026-06-13T17:00",
    arrDist: 55,
    modes: ["Company Car"],
    lodgingRate: 200,
    lodgingDays: 1,
    lodgingTotal: 200,
    mileage: 0,
    fuel: 60,
    toll: 20,
    airfares: 0,
    subsistenceRate: 60,
    subsistenceDays: 2,
    subsistenceTotal: 120,
    entDetail: "",
    entTotal: 0,
    costTotal: 400,
    advanceAmount: 0
  },
  {
    id: "TW-1003",
    staffId: "IM005",
    staffName: "KOH SHU BOH",
    role: "HEAD OF AFTER SALES",
    destination: "Ferrari Italy HQ — Maranello",
    purpose: "After Sales Technical Training",
    startDate: "2026-07-02",
    endDate: "2026-07-08",
    transport: "Air",
    budget: 8500,
    notes: "Annual technical workshop and product update briefing.",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-07",
    jobGrade: "Manager",
    divDept: "AFTER SALES",
    branch: "Ital Auto Kuala Lumpur",
    deptTime: "2026-07-02T06:00",
    deptDist: 60,
    arrTime: "2026-07-08T23:30",
    arrDist: 60,
    modes: ["Air"],
    lodgingRate: 600,
    lodgingDays: 6,
    lodgingTotal: 3600,
    mileage: 0,
    fuel: 0,
    toll: 0,
    airfares: 3800,
    subsistenceRate: 120,
    subsistenceDays: 6,
    subsistenceTotal: 720,
    entDetail: "",
    entTotal: 0,
    costTotal: 8120,
    advanceAmount: 2000
  },
  {
    id: "TW-1004",
    staffId: "IM030",
    staffName: "NUR FARAH HANEE BINTI ZAMARUDDIN",
    role: "EXECUTIVE",
    destination: "Penang — HR Compliance Audit",
    purpose: "HR Compliance & Payroll Review",
    startDate: "2026-06-18",
    endDate: "2026-06-19",
    transport: "Air",
    budget: 900,
    notes: "Annual HR audit with group compliance team.",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-07",
    jobGrade: "Executive / Specialist",
    divDept: "HUMAN RESOURCE & ADMINISTRATION",
    branch: "Ital Auto Kuala Lumpur",
    deptTime: "2026-06-18T08:00",
    deptDist: 10,
    arrTime: "2026-06-19T17:00",
    arrDist: 10,
    modes: ["Air"],
    lodgingRate: 180,
    lodgingDays: 1,
    lodgingTotal: 180,
    mileage: 0,
    fuel: 0,
    toll: 0,
    airfares: 380,
    subsistenceRate: 60,
    subsistenceDays: 2,
    subsistenceTotal: 120,
    entDetail: "",
    entTotal: 0,
    costTotal: 680,
    advanceAmount: 0
  }
];

const DEFAULT_LEAVES = [
  {
    id: "LV-2001",
    staffId: "IM011",
    staffName: "SHARIFAH SYAFIYAH BINTI SYED HASHIM",
    leaveType: "SICK LEAVE",
    startDate: "2026-05-12",
    endDate: "2026-05-13",
    totalDays: 2,
    reason: "Fever and flu symptoms, medical certificate attached.",
    reliefStaff: "IM048",
    status: "Approved",
    remarks: "MC submitted and approved.",
    dateApplied: "2026-05-11",
    approvers: "NG MUN KHAI >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2002",
    staffId: "IM036",
    staffName: "MUHAMMAD FARHAN BIN OTHMAN",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-22",
    endDate: "2026-06-25",
    totalDays: 4,
    reason: "Family vacation.",
    reliefStaff: "IM049",
    status: "Approved",
    remarks: "Approved by manager.",
    dateApplied: "2026-06-01",
    approvers: "STEFAN TAN TONG WEI >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2003",
    staffId: "IM019",
    staffName: "FARINA SHAZLEEN BINTI MOHAMAD JAAFAR",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-15",
    endDate: "2026-06-19",
    totalDays: 5,
    reason: "Personal leave.",
    reliefStaff: "IM026",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-06",
    approvers: "MOHD RAFAE BIN YUSOF >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2004",
    staffId: "IM030",
    staffName: "NUR FARAH HANEE BINTI ZAMARUDDIN",
    leaveType: "EMERGENCY LEAVE",
    startDate: "2026-06-09",
    endDate: "2026-06-10",
    totalDays: 2,
    reason: "Urgent family matter.",
    reliefStaff: "IM022",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-08",
    approvers: "NOR AZIMAH BINTI MUSTAFA >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2005",
    staffId: "IM013",
    staffName: "PRADHEEP MANI A/L VELLA KUPPAN",
    leaveType: "REPLACEMENT LEAVE",
    startDate: "2026-06-24",
    endDate: "2026-06-26",
    totalDays: 3,
    reason: "REPLACEMENT LEAVE",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-03",
    referenceNo: "31/1, 11/4, 25/4, 16/5, 30/5 - Saturdays",
    ampm: "",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2006",
    staffId: "IM039",
    staffName: "NOR NAJWA BINTI MOHD HAIZAR",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-19",
    endDate: "2026-06-19",
    totalDays: 1,
    reason: "PERSONAL MATTER",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-08",
    referenceNo: "NUZUL QURAN REPLACEMENT LEAVE",
    ampm: "",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2007",
    staffId: "IM008",
    staffName: "SANKARAN A/L JAYARAMAN",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-18",
    endDate: "2026-06-19",
    totalDays: 2,
    reason: "heading to johor to visit relatives",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-05",
    referenceNo: "personal",
    ampm: "",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2008",
    staffId: "IM041",
    staffName: "MUHAMMAD EZRAL HAIKAL BIN RAZAK",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-18",
    endDate: "2026-06-19",
    totalDays: 2,
    reason: "",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-06",
    referenceNo: "Annual leave",
    ampm: "",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2009",
    staffId: "IM046",
    staffName: "MOHD MAHADI BIN YAACOB",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-15",
    endDate: "2026-06-16",
    totalDays: 2,
    reason: "",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-09",
    referenceNo: "Annual Leave",
    ampm: "",
    approvers: "SAMSON ANAND GEORGE"
  },
  {
    id: "LV-2010",
    staffId: "IM011",
    staffName: "SHARIFAH SYAFIYAH BINTI SYED HASHIM",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-12",
    endDate: "2026-06-12",
    totalDays: 1,
    reason: "",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-07",
    referenceNo: "",
    ampm: "",
    approvers: "NG MUN KHAI"
  },
  {
    id: "LV-2011",
    staffId: "IM028",
    staffName: "PRISSILLA JOYCE A/P PAUL RAMANAIDOO",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-12",
    endDate: "2026-06-12",
    totalDays: 0.5,
    reason: "Personal event",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-08",
    referenceNo: "",
    ampm: "AM",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2012",
    staffId: "IM007",
    staffName: "HELMEY BIN HASSIM",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-10",
    endDate: "2026-06-10",
    totalDays: 1,
    reason: "urusan di melaka",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-07",
    referenceNo: "",
    ampm: "",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2013",
    staffId: "IM028",
    staffName: "PRISSILLA JOYCE A/P PAUL RAMANAIDOO",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-10",
    endDate: "2026-06-10",
    totalDays: 1,
    reason: "Friends wedding",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-02",
    referenceNo: "",
    ampm: "",
    approvers: "KOH SHU BOH >> SURAISH KUMAR A/L SUBRAMANIAM"
  },
  {
    id: "LV-2014",
    staffId: "IM019",
    staffName: "FARINA SHAZLEEN BINTI MOHAMAD JAAFAR",
    leaveType: "ANNUAL LEAVE",
    startDate: "2026-06-09",
    endDate: "2026-06-09",
    totalDays: 0.5,
    reason: "personal matter",
    reliefStaff: "-",
    status: "Pending",
    remarks: "",
    dateApplied: "2026-06-06",
    referenceNo: "",
    ampm: "PM",
    approvers: "MOHD RAFAE BIN YUSOF"
  }
];

// ==========================================
// DATABASE UTILITIES & LIFE-CYCLE
// ==========================================

function initDatabase() {
  // Always reload if initialization brand changed, or check if initialized
  if (!localStorage.getItem("ital_auto_hrms_initialized")) {
    localStorage.setItem("ferrari_hrms_users", JSON.stringify(DEFAULT_USERS));
    localStorage.setItem("ferrari_hrms_travels", JSON.stringify(DEFAULT_TRAVELS));
    localStorage.setItem("ferrari_hrms_leaves", JSON.stringify(DEFAULT_LEAVES));
    localStorage.setItem("ital_auto_hrms_initialized", "true");
  }

  // Load from LocalStorage into active memory state
  state.users = JSON.parse(localStorage.getItem("ferrari_hrms_users"));
  state.travels = JSON.parse(localStorage.getItem("ferrari_hrms_travels"));
  state.leaves = JSON.parse(localStorage.getItem("ferrari_hrms_leaves"));
  
  if (!localStorage.getItem("ferrari_hrms_announcements")) {
    const DEFAULT_ANNOUNCEMENTS = [
      {
        id: "ann-1",
        title: "Ferrari F8 Tributo Showcase Event Logistics",
        content: "Please note that all operations and sales personnel involved in the F8 Tributo showcase at the Kuala Lumpur showroom must submit their travel warrants by this Friday, June 26, 2026. Parking details and passes will be shared next week.",
        date: "2026-06-22",
        author: "Eleanor Vance"
      },
      {
        id: "ann-2",
        title: "Mid-Year System Performance Reviews",
        content: "The mid-year performance review portal is now open. All staff members are requested to complete their self-evaluation forms in the HR portal. HODs, please schedule alignment sessions before July 10, 2026.",
        date: "2026-06-18",
        author: "Eleanor Vance"
      },
      {
        id: "ann-3",
        title: "Company Annual Dinner 2026 Announcement",
        content: "We are thrilled to announce that the Ital Auto Annual Dinner 2026 will be held at the Ritz-Carlton Kuala Lumpur on August 15. The theme this year is 'Racing Heritage - Rosso Corsa'. Please choose your dress size and diet preferences on your profile page.",
        date: "2026-06-12",
        author: "Eleanor Vance"
      }
    ];
    localStorage.setItem("ferrari_hrms_announcements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  }
  state.announcements = JSON.parse(localStorage.getItem("ferrari_hrms_announcements"));
  
  // Backwards compat check (reset if new staff IDs are missing or stale data detected)
  const requiredIds = ["IM018", "IM022", "IM030", "IM043", "IM005", "Nick Syn"];
  const missingIds = requiredIds.some(id => !state.users[id]);
  const hasOldFakeAccounts = state.users["HR-001"] || state.users["ST-001"];
  if (missingIds || hasOldFakeAccounts) {
    state.users = DEFAULT_USERS;
    state.travels = DEFAULT_TRAVELS;
    state.leaves = DEFAULT_LEAVES;
    localStorage.setItem("ital_auto_hrms_initialized", "true");
    saveDatabase();
  }
}

function saveDatabase() {
  localStorage.setItem("ferrari_hrms_users", JSON.stringify(state.users));
  localStorage.setItem("ferrari_hrms_travels", JSON.stringify(state.travels));
  localStorage.setItem("ferrari_hrms_leaves", JSON.stringify(state.leaves));
  localStorage.setItem("ferrari_hrms_announcements", JSON.stringify(state.announcements));
}

// Helper: Calculate days between dates (inclusive)
function calculateDays(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

// Helper: Format date for standard human display
function formatHumanDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

// Helper: Get today's formatted date
function getTodayFormattedString() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return state.currentCalendarDate.toLocaleDateString('en-US', options);
}

// ==========================================
// DEPARTMENT → EMPLOYEE UTILITY
// ==========================================

/**
 * Populate an employee <select> based on a chosen department value.
 * @param {string} deptValue  - The department name (e.g. "AFTER SALES") or "- ALL -"
 * @param {HTMLSelectElement} empSelect - The employee dropdown element to populate
 * @param {boolean} includeAll - Whether to include a "- ALL -" option at top
 * @param {string|null} currentUserId - If set, pre-select this user
 */
function populateEmployeeDropdown(deptValue, empSelect, includeAll = false, currentUserId = null) {
  if (!empSelect) return;
  empSelect.innerHTML = '';

  if (includeAll) {
    const allOpt = document.createElement('option');
    allOpt.value = '- ALL -';
    allOpt.textContent = '- ALL -';
    empSelect.appendChild(allOpt);
  }

  const users = state.users || {};
  const filtered = Object.values(users).filter(u => {
    if (deptValue === '- ALL -') return true;
    return u.department === deptValue;
  });

  // Sort alphabetically by name
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  filtered.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = `${u.name} (${u.id})`;
    if (currentUserId && u.id === currentUserId) opt.selected = true;
    empSelect.appendChild(opt);
  });
}

/**
 * Wire department select → employee select pairs for all forms on the page.
 * Called once after the database is loaded.
 */
function initDeptEmployeeSelects() {
  // Map of [deptSelectId, empSelectId, includeAllInEmp]
  const pairs = [
    // HR Leave Apply form
    ['leave-hr-dept',         'leave-hr-employee',        false],
    // HR Approve Leave filter
    ['approve-filter-dept',   'approve-filter-employee',  true],
    // Report filter
    ['report-filter-dept',    'report-filter-employee',   true],
    // Staff Leave Apply form (dept is readonly but emp still loads)
    ['leave-staff-dept',      'leave-staff-employee',     false],
    // Travel HR apply — div/dept is a text input so we skip (handled separately)
    // Travel staff apply — div/dept is a text input so we skip
  ];

  pairs.forEach(([deptId, empId, inclAll]) => {
    const deptSel = document.getElementById(deptId);
    const empSel  = document.getElementById(empId);
    if (!deptSel || !empSel) return;

    // Initial population
    populateEmployeeDropdown(deptSel.value, empSel, inclAll);

    // Reactively update when dept changes
    deptSel.addEventListener('change', () => {
      populateEmployeeDropdown(deptSel.value, empSel, inclAll);
    });
  });

  // For staff leave/travel apply: auto-set dept + lock employee to current user
  const staffDeptLeave = document.getElementById('leave-staff-dept');
  const staffEmpLeave  = document.getElementById('leave-staff-employee');
  if (staffDeptLeave && staffEmpLeave && state.currentUser) {
    staffDeptLeave.value = state.currentUser.department;
    populateEmployeeDropdown(state.currentUser.department, staffEmpLeave, false, state.currentUser.id);
    staffEmpLeave.disabled = true; // staff can only submit for themselves
  }

  // For HR leave apply: pre-select the current HR user's dept & themselves
  const hrDeptLeave = document.getElementById('leave-hr-dept');
  const hrEmpLeave  = document.getElementById('leave-hr-employee');
  if (hrDeptLeave && hrEmpLeave && state.currentUser) {
    // HR can apply for ANY employee; default to their own dept
    hrDeptLeave.value = state.currentUser.department;
    populateEmployeeDropdown(hrDeptLeave.value, hrEmpLeave, false, state.currentUser.id);
  }

  // Travel Div/Dept text fields: auto-fill from current user
  const travelHrDept = document.getElementById('travel-hr-dept');
  if (travelHrDept && state.currentUser) {
    travelHrDept.value = state.currentUser.department;
  }
  const travelStaffDept = document.getElementById('travel-staff-dept');
  if (travelStaffDept && state.currentUser) {
    travelStaffDept.value = state.currentUser.department;
  }
}

// ==========================================
// NOTIFICATIONS (TOASTS)
// ==========================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "fa-check-circle";
  if (type === "error") icon = "fa-exclamation-circle";
  if (type === "info") icon = "fa-circle-info";

  toast.innerHTML = `
    <span class="toast-icon"><i class="fa-solid ${icon}"></i></span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = "fadeInDown 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Confetti burst for key accomplishments
function triggerConfetti() {
  if (window.confetti) {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E00000', '#F4CA16', '#ffffff', '#1A1A1A']
    });
  }
}

// ==========================================
// AUTHENTICATION & LOGIN FLOW
// ==========================================

function validatePasswordRequirements(password, isManagement) {
  if (!isManagement) {
    if (password.length < 4) {
      return { valid: false, message: "Password must be at least 4 characters long." };
    }
    return { valid: true };
  }
  
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number (0-9)." };
  }
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character (!@#$%^&*)." };
  }
  return { valid: true };
}

function handleLogin(staffId) {
  let cleanedId = staffId.trim().toUpperCase();
  if (cleanedId.includes("@")) {
    cleanedId = cleanedId.split("@")[0];
  }
  
  // Case-insensitive key lookup
  const foundKey = Object.keys(state.users).find(k => k.toUpperCase() === cleanedId);
  const user = foundKey ? state.users[foundKey] : null;

  if (!user) {
    showToast("Invalid Staff ID. Example: IM022 (HR Admin), IM043 (Staff), or Nick Syn.", "error");
    return false;
  }

  // Password check — required for any account that has a password
  if (user.password) {
    const pwdInput = document.getElementById("password-input");
    const enteredPwd = pwdInput ? pwdInput.value : "";
    if (!enteredPwd) {
      showToast("This account requires a password to log in.", "error");
      if (pwdInput) pwdInput.focus();
      return false;
    }
    if (enteredPwd !== user.password) {
      showToast("Incorrect password. Please try again.", "error");
      if (pwdInput) { pwdInput.value = ""; pwdInput.focus(); }
      return false;
    }

    // First login check
    if (!user.passwordChanged) {
      document.getElementById("reset-staff-id-hidden").value = user.id;
      document.getElementById("login-form").style.display = "none";
      document.getElementById("reset-password-form").style.display = "block";
      
      const reqBox = document.getElementById("pwd-requirements-box");
      if (reqBox) {
        reqBox.style.display = user.isManagement ? "block" : "none";
      }
      showToast("Password reset required on first login.", "info");
      return false;
    }
  }

  localStorage.setItem("ferrari_hrms_session_user", JSON.stringify(user));
  state.currentUser = user;

  // Update UI user panels safely
  const selectorWelcome = document.getElementById("selector-welcome-msg");
  if (selectorWelcome) selectorWelcome.innerHTML = `Welcome back, <span>${user.name}</span>!`;

  const sidebarName = document.getElementById("sidebar-user-name");
  if (sidebarName) sidebarName.textContent = user.name;

  const sidebarRole = document.getElementById("sidebar-user-role");
  if (sidebarRole) sidebarRole.textContent = user.role;

  const sidebarId = document.getElementById("sidebar-user-id");
  if (sidebarId) sidebarId.textContent = user.id;
  
  const initials = user.initials || user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const sidebarAvatar = document.getElementById("sidebar-user-avatar");
  if (sidebarAvatar) sidebarAvatar.textContent = initials;

  // Sync with top header profile if it exists
  const headerName = document.getElementById("header-user-name");
  const headerRole = document.getElementById("header-user-role");
  const headerAvatar = document.getElementById("header-user-avatar");
  if (headerName) headerName.textContent = user.name;
  if (headerRole) headerRole.textContent = user.role;
  if (headerAvatar) headerAvatar.textContent = initials;

  showToast(`Logged in successfully as ${user.name}`);
  triggerConfetti();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 800);
  return true;
}

function handleFirstLoginReset(event) {
  event.preventDefault();
  const staffId = document.getElementById("reset-staff-id-hidden").value;
  const newPwd = document.getElementById("reset-new-pwd").value;
  const confirmPwd = document.getElementById("reset-confirm-pwd").value;

  const user = state.users[staffId];
  if (!user) {
    showToast("User not found.", "error");
    return;
  }

  if (newPwd !== confirmPwd) {
    showToast("Passwords do not match.", "error");
    return;
  }

  // Validate strict requirements if they are management
  const validation = validatePasswordRequirements(newPwd, user.isManagement);
  if (!validation.valid) {
    showToast(validation.message, "error");
    return;
  }

  // Save new password
  user.password = newPwd;
  user.passwordChanged = true;
  saveDatabase();

  showToast("Password updated successfully!", "success");
  
  // Log them in
  localStorage.setItem("ferrari_hrms_session_user", JSON.stringify(user));
  state.currentUser = user;

  triggerConfetti();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 800);
}

function handleLogout() {
  localStorage.removeItem("ferrari_hrms_session_user");
  state.currentUser = null;
  state.activeSystem = null;
  state.activeSection = null;
  
  showToast("Logged out successfully", "info");
  
  setTimeout(() => {
    window.location.href = "logout.html";
  }, 500);
}

// ==========================================
// NAVIGATION CONTROLLER
// ==========================================

function navigateUI() {
  const loginScreen = document.getElementById("login-screen");
  const selectorScreen = document.getElementById("system-selector-screen");
  const mainAppScreen = document.getElementById("main-app-screen");

  // Reset side active classes
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));

  if (!state.currentUser) {
    if (loginScreen) loginScreen.classList.remove("hidden");
    if (selectorScreen) selectorScreen.classList.add("hidden");
    if (mainAppScreen) mainAppScreen.classList.add("hidden");
  } else if (!state.activeSystem) {
    if (loginScreen) loginScreen.classList.add("hidden");
    if (selectorScreen) selectorScreen.classList.remove("hidden");
    if (mainAppScreen) mainAppScreen.classList.add("hidden");
  } else {
    if (loginScreen) loginScreen.classList.add("hidden");
    if (selectorScreen) selectorScreen.classList.add("hidden");
    if (mainAppScreen) mainAppScreen.classList.remove("hidden");

    // Establish active navigation side menus
    buildSidebarMenu();
    
    // Default to the Dashboard section of the selected system if none is active
    if (!state.activeSection) {
      if (state.activeSystem === "travel") {
        state.activeSection = state.currentUser.isAdmin ? "sec-travel-hr-dashboard" : "sec-travel-staff-dashboard";
      } else {
        state.activeSection = state.currentUser.isAdmin ? "sec-leave-hr-dashboard" : "sec-leave-staff-dashboard";
      }
    }

    // Toggle Content Sections
    const sections = document.querySelectorAll(".content-body > section");
    sections.forEach(sec => {
      if (sec.id === state.activeSection) {
        sec.classList.remove("hidden");
      } else {
        sec.classList.add("hidden");
      }
    });

    // Update main header elements safely
    const systemName = state.activeSystem === "travel" ? "Travel Warrant" : "E-Leave";
    const headerSysName = document.getElementById("header-system-name");
    if (headerSysName) headerSysName.textContent = systemName;

    const headerCurDate = document.getElementById("header-current-date");
    if (headerCurDate) headerCurDate.textContent = getTodayFormattedString();

    const titleEl = document.getElementById("header-section-title");
    if (titleEl) titleEl.textContent = getSectionTitle(state.activeSection);

    // Set side menu active class
    const sidebarItem = document.querySelector(`.menu-item[data-target="${state.activeSection}"]`);
    if (sidebarItem) sidebarItem.classList.add("active");

    // Render corresponding section data
    renderSectionData(state.activeSection);
    
    // Inject Mock Inbox Icon if needed
    if (typeof ensureHeaderInboxIconExists === "function") {
      ensureHeaderInboxIconExists();
    }
  }
}

function getSectionTitle(sectionId) {
  const titles = {
    "sec-travel-hr-dashboard": "HR Travel Dashboard",
    "sec-travel-hr-approve": "Approve Travel Warrants",
    "sec-travel-hr-report": "HR Travel Reports",
    "sec-travel-hr-apply": "Apply for Travel Warrant",
    "sec-travel-hr-my": "My Travel Warrants",
    "sec-travel-staff-dashboard": "Staff Travel Dashboard",
    "sec-travel-staff-apply": "Apply for Travel Warrant",
    "sec-travel-staff-my": "My Travel Warrants", // Staff status view name
    
    "sec-leave-hr-dashboard": "HR Leave Dashboard",
    "sec-leave-hr-approve": "Approve Leaves",
    "sec-leave-hr-apply": "Apply for Leave",
    "sec-leave-hr-report": "HR Leave Reports",
    "sec-leave-hr-my": "My Leaves",
    "sec-leave-staff-dashboard": "Staff Leave Dashboard",
    "sec-leave-staff-apply": "Apply for Leave",
    "sec-leave-staff-my": "My Leaves",
    "sec-hr-user-management": "HR User Management"
  };
  return titles[sectionId] || "HRMS Portal";
}

function buildSidebarMenu() {
  const menuContainer = document.getElementById("sidebar-nav-menu");
  menuContainer.innerHTML = ""; // Clear existing

  let items = [];

  if (state.activeSystem === "travel") {
    if (state.currentUser.isAdmin) {
      items = [
        { label: "HR Dashboard", target: "sec-travel-hr-dashboard", icon: "fa-chart-line" },
        { label: "Approve Warrants", target: "sec-travel-hr-approve", icon: "fa-clipboard-check" },
        { label: "Travel Report", target: "sec-travel-hr-report", icon: "fa-file-contract" },
        { label: "Apply Travel", target: "sec-travel-hr-apply", icon: "fa-pen-to-square" },
        { label: "My Travel Warrant", target: "sec-travel-hr-my", icon: "fa-passport" },
        { label: "User Management", target: "sec-hr-user-management", icon: "fa-users-gear" }
      ];
    } else {
      items = [
        { label: "Staff Dashboard", target: "sec-travel-staff-dashboard", icon: "fa-chart-line" },
        { label: "Apply Travel", target: "sec-travel-staff-apply", icon: "fa-pen-to-square" },
        { label: "My Travel Warrants", target: "sec-travel-staff-my", icon: "fa-clipboard-list" }
      ];
    }
  } else { // E-Leave
    if (state.currentUser.isAdmin) {
      items = [
        { label: "HR Dashboard", target: "sec-leave-hr-dashboard", icon: "fa-chart-line" },
        { label: "Approve Leaves", target: "sec-leave-hr-approve", icon: "fa-calendar-check" },
        { label: "Leave Report", target: "sec-leave-hr-report", icon: "fa-file-contract" },
        { label: "Apply Leave", target: "sec-leave-hr-apply", icon: "fa-pen-to-square" },
        { label: "My Leaves", target: "sec-leave-hr-my", icon: "fa-calendar-days" },
        { label: "User Management", target: "sec-hr-user-management", icon: "fa-users-gear" }
      ];
    } else {
      items = [
        { label: "Staff Dashboard", target: "sec-leave-staff-dashboard", icon: "fa-chart-line" },
        { label: "Apply Leave", target: "sec-leave-staff-apply", icon: "fa-pen-to-square" },
        { label: "My Leaves", target: "sec-leave-staff-my", icon: "fa-calendar-days" }
      ];
    }
  }


  items.forEach(item => {
    const btn = document.createElement("div");
    btn.className = `menu-item ${state.activeSection === item.target ? 'active' : ''}`;
    btn.setAttribute("data-target", item.target);
    btn.innerHTML = `
      <i class="fa-solid ${item.icon}"></i>
      <span>${item.label}</span>
    `;
    btn.addEventListener("click", () => {
      state.activeSection = item.target;
      navigateUI();
      // Hide mobile sidebar if open
      document.getElementById("sidebar-nav-menu").closest(".sidebar").classList.remove("active");
    });
    menuContainer.appendChild(btn);
  });
}

// Switch between E-Leave and Travel modules (role-aware)
function switchSystemModule() {
  const isAdmin = state.currentUser?.isAdmin;
  if (state.activeSystem === "travel") {
    window.location.href = isAdmin ? "e-leave_hr.html" : "e-leave_st.html";
  } else {
    window.location.href = isAdmin ? "travel_hr.html" : "travel_st.html";
  }
}

// ==========================================
// RENDER MODULES DATA
// ==========================================

function renderSectionData(sectionId) {
  switch (sectionId) {
    // ----------------------------------------
    // TRAVEL WARRANT SYSTEM: HR
    // ----------------------------------------
    case "sec-travel-hr-dashboard":
      renderTravelHRDashboard();
      break;
    case "sec-travel-hr-approve":
      renderTravelHRApprove();
      break;
    case "sec-travel-hr-apply":
      prefillTravelApplyForm(true);
      break;
    case "sec-travel-hr-my":
      renderTravelHRMy();
      break;
    case "sec-travel-hr-report":
      initTravelReportPage();
      break;

    // TRAVEL WARRANT SYSTEM: STAFF
    case "sec-travel-staff-dashboard":
      renderTravelStaffDashboard();
      break;
    case "sec-travel-staff-apply":
      prefillTravelApplyForm(false);
      break;
    case "sec-travel-staff-my":
      renderTravelStaffMy();
      break;

    // ----------------------------------------
    // E-LEAVE SYSTEM: HR
    // ----------------------------------------
    case "sec-leave-hr-dashboard":
      renderLeaveHRDashboard();
      break;
    case "sec-leave-hr-approve":
      renderLeaveHRApprove();
      break;
    case "sec-leave-hr-my":
      renderLeaveHRMy();
      break;
    case "sec-leave-hr-apply":
      initLeaveApplyForm(true);
      break;
    case "sec-leave-hr-report":
      initLeaveReportPage();
      break;

    // E-LEAVE SYSTEM: STAFF
    case "sec-leave-staff-dashboard":
      renderLeaveStaffDashboard();
      break;
    case "sec-leave-staff-my":
      renderLeaveStaffMy();
      break;
    case "sec-leave-staff-apply":
      initLeaveApplyForm(false);
      break;
    case "sec-hr-user-management":
      renderHRUserManagement();
      break;
  }
}

// ========================================================
// TRAVEL WARRANT - HR
// ========================================================

function renderTravelHRDashboard() {
  const metricsContainer = document.getElementById("travel-hr-dashboard-metrics");
  const requestsTbody = document.getElementById("travel-hr-recent-requests-tbody");
  
  // Calculations
  const allTravels = state.travels;
  const totalApplied = allTravels.length;
  const pending = allTravels.filter(t => t.status === "Pending").length;
  const approved = allTravels.filter(t => t.status === "Approved").length;
  const rejected = allTravels.filter(t => t.status === "Rejected").length;

  metricsContainer.innerHTML = `
    <!-- Card 1: Active Employees -->
    <div class="metric-card active-employees-card">
      <div class="metric-info-side">
        <div class="metric-label">Active Employees</div>
        <div class="metric-value">2,354</div>
      </div>
      <div class="metric-icon-box pink-container">
        <i class="fa-solid fa-users"></i>
      </div>
    </div>
    
    <!-- Card 2: Today's Attendance -->
    <div class="metric-card attendance-card">
      <div class="metric-info-side">
        <div class="metric-label">Today's Attendance</div>
        <div class="attendance-percentage">98%</div>
        <div class="attendance-subtitle">On time matches the attendance standard.</div>
      </div>
      <div class="attendance-gold-shape">
        <div class="metric-icon-box gold-circle">
          <i class="fa-solid fa-calendar-day"></i>
        </div>
      </div>
    </div>
    
    <!-- Card 3: Travel Requests (With 3 Sub-Cards) -->
    <div class="metric-card travel-requests-large-card">
      <div class="large-card-header">
        <span class="large-card-title">Travel Requests</span>
        <span class="large-card-badge"><i class="fa-solid fa-circle-exclamation"></i> Approved</span>
      </div>
      <div class="sub-cards-grid">
        <div class="sub-card pending-sub-card">
          <div class="sub-card-label">Pending Approval</div>
          <div class="sub-card-value">${pending}</div>
        </div>
        <div class="sub-card approved-sub-card">
          <div class="sub-card-label">Approved</div>
          <div class="sub-card-value">${approved}</div>
        </div>
        <div class="sub-card rejected-sub-card">
          <div class="sub-card-label">Rejected</div>
          <div class="sub-card-value">${rejected}</div>
        </div>
      </div>
    </div>
  `;

  // Recent Requests Table (limit 6)
  requestsTbody.innerHTML = "";
  const sortedTravels = [...allTravels].reverse();
  const displayTravels = sortedTravels.slice(0, 6);

  if (displayTravels.length === 0) {
    requestsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No travel applications recorded.</td></tr>`;
  } else {
    displayTravels.forEach(t => {
      const statusClass = t.status.toLowerCase();
      requestsTbody.innerHTML += `
        <tr>
          <td>${t.staffId}</td>
          <td style="font-weight: 600;">${t.staffName}</td>
          <td>${t.destination}</td>
          <td>${formatHumanDate(t.startDate)}</td>
          <td>${t.purpose}</td>
          <td><span class="badge ${statusClass}">${t.status}</span></td>
        </tr>
      `;
    });
  }

  // Update SVG Semi-Donut Chart
  updateTravelDonutChart(approved, pending, totalApplied - approved - pending);
}

function updateTravelDonutChart(approved, pending, rejected) {
  const total = approved + pending + rejected;
  const totalText = document.getElementById("chart-travel-total-text");
  totalText.textContent = total;

  const circleApproved = document.getElementById("chart-travel-approved-segment");
  const circlePending = document.getElementById("chart-travel-pending-segment");
  const circleRejected = document.getElementById("chart-travel-rejected-segment");

  if (total === 0) {
    circleApproved.setAttribute("stroke-dashoffset", 502);
    circlePending.setAttribute("stroke-dashoffset", 502);
    circleRejected.setAttribute("stroke-dashoffset", 502);
    return;
  }

  const cLength = 502.65; // Circumference (2 * pi * r) where r = 80

  const approvedPercent = approved / total;
  const pendingPercent = pending / total;
  const rejectedPercent = rejected / total;

  // Segment stroke dash offsets calculations
  // Approved starts at offset 0
  const strokeOffsetApproved = cLength - (approvedPercent * cLength);
  circleApproved.setAttribute("stroke-dasharray", `${approvedPercent * cLength} ${cLength}`);
  circleApproved.setAttribute("stroke-dashoffset", 0);
  circleApproved.style.transform = "rotate(0deg)";

  // Pending starts after Approved
  circlePending.setAttribute("stroke-dasharray", `${pendingPercent * cLength} ${cLength}`);
  circlePending.setAttribute("stroke-dashoffset", -(approvedPercent * cLength));
  circlePending.style.transform = "rotate(0deg)";

  // Rejected starts after Pending
  circleRejected.setAttribute("stroke-dasharray", `${rejectedPercent * cLength} ${cLength}`);
  circleRejected.setAttribute("stroke-dashoffset", -((approvedPercent + pendingPercent) * cLength));
  circleRejected.style.transform = "rotate(0deg)";
}

function renderTravelHRApprove() {
  const tbody = document.getElementById("travel-hr-approve-tbody");
  if (!tbody) return;

  // Read filters
  const deptFilter    = (document.getElementById("tw-filter-dept")    || {}).value || "- ALL -";
  const empFilter     = (document.getElementById("tw-filter-employee") || {}).value || "- ALL -";
  const statusFilter  = (document.getElementById("tw-filter-status")  || {}).value || "Pending";
  const purposeFilter = (document.getElementById("tw-filter-purpose") || {}).value || "- ALL -";
  const limit         = parseInt((document.getElementById("tw-pagination-limit") || {}).value || "100");
  const pageEl        = document.getElementById("tw-pagination-page");
  const currentPage   = parseInt((pageEl || {}).value || "1");

  // Build candidate list (exclude own requests)
  let records = state.travels.filter(t => t.staffId !== state.currentUser.id);

  // Apply filters
  if (deptFilter !== "- ALL -") {
    records = records.filter(t => {
      const u = state.users[t.staffId];
      return u && u.department === deptFilter;
    });
  }
  if (empFilter !== "- ALL -") {
    records = records.filter(t => t.staffId === empFilter);
  }
  if (statusFilter !== "- ALL -") {
    if (statusFilter === "Pending") {
      records = records.filter(t => t.status === "Pending" || t.status === "Pending Recommendation" || t.status === "Pending Approval");
    } else {
      records = records.filter(t => t.status === statusFilter);
    }
  }
  if (purposeFilter !== "- ALL -") {
    records = records.filter(t => t.purpose === purposeFilter);
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(records.length / limit));
  const safeePage  = Math.min(currentPage, totalPages);
  const sliced     = records.slice((safeePage - 1) * limit, safeePage * limit);

  // Update pagination UI
  const totalPagesEl = document.getElementById("tw-pagination-total-pages");
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  if (pageEl) {
    pageEl.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      if (i === safeePage) opt.selected = true;
      pageEl.appendChild(opt);
    }
  }
  const setPageLink = (id, disabled) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("disabled", disabled);
  };
  setPageLink("tw-pagination-first", safeePage <= 1);
  setPageLink("tw-pagination-prev",  safeePage <= 1);
  setPageLink("tw-pagination-next",  safeePage >= totalPages);
  setPageLink("tw-pagination-last",  safeePage >= totalPages);

  // Render rows
  tbody.innerHTML = "";
  if (sliced.length === 0) {
    tbody.innerHTML = `<tr><td colspan="14" style="text-align:center;color:var(--text-secondary);padding:2rem;">No travel warrant requests match the current filters.</td></tr>`;
    return;
  }

  sliced.forEach(t => {
    const statusClass = t.status === "Approved" ? "approved" : t.status === "Rejected" ? "rejected" : "pending";
    const u = state.users[t.staffId] || {};
    const approver = t.approvedBy || t.actionBy || "-";
    const submissionDate = t.dateApplied || t.createdAt || "-";
    tbody.innerHTML += `
      <tr data-id="${t.id}" id="tw-row-${t.id}">
        <td style="text-align:left;">
          <span class="expand-row-btn" id="tw-expand-btn-${t.id}" onclick="toggleExpandTravelRow('${t.id}')">+</span>
          <input type="checkbox" class="tw-row-checkbox" data-id="${t.id}" style="margin-right:8px;vertical-align:middle;">
          <a class="view-link" onclick="viewTravelWarrant('${t.id}')"><i class="fa-solid fa-eye" style="margin-right:3px;"></i>View</a>
        </td>
        <td><span class="badge ${statusClass}">${t.status}</span></td>
        <td>${t.staffId}</td>
        <td style="font-weight:600;white-space:nowrap;">${t.staffName}</td>
        <td>${t.destination}</td>
        <td style="white-space:nowrap;">${formatHumanDate(t.startDate)}</td>
        <td style="white-space:nowrap;">${formatHumanDate(t.endDate)}</td>
        <td>${t.purpose || "-"}</td>
        <td>${t.transport || "-"}</td>
        <td style="font-weight:600;">RM ${t.costTotal || t.budget || "0"}</td>
        <td style="color:var(--text-secondary);font-style:italic;">${t.remarks || "-"}</td>
        <td style="white-space:nowrap;">${submissionDate}</td>
        <td>${approver}</td>
        <td>${t.approvers || "HR Dept"}</td>
      </tr>
      <tr class="expanded-detail-row hidden" id="tw-detail-row-${t.id}">
        <td colspan="14">
          <div class="expanded-detail-container">
            <strong>Employee ID:</strong> ${t.staffId} | 
            <strong>Role:</strong> ${u.role || "Staff"} | 
            <strong>Department:</strong> ${t.divDept || u.department || "Operations"} <br>
            <strong>Travel Duration:</strong> ${formatHumanDate(t.startDate)} to ${formatHumanDate(t.endDate)} <br>
            <strong>Purpose of Travel:</strong> ${t.purpose || "-"} <br>
            <strong>Estimated Cost Breakdown:</strong> Lodging: RM ${t.lodgingTotal || 0} | Mileage: RM ${t.mileage || 0} | Fuel: RM ${t.fuel || 0} | Toll: RM ${t.toll || 0} | Airfares: RM ${t.airfares || 0} | Subsistence: RM ${t.subsistenceTotal || 0} | Entertainment: RM ${t.entTotal || 0} (Total: RM ${t.costTotal || t.budget || 0}) <br>
            <strong>Approver chain hierarchy:</strong> ${t.approvers || "HR Dept"}
          </div>
        </td>
      </tr>
    `;
  });

  // Select-all checkbox
  const selectAll = document.getElementById("tw-select-all");
  if (selectAll) {
    selectAll.checked = false;
    selectAll.onchange = () => {
      document.querySelectorAll(".tw-row-checkbox").forEach(cb => cb.checked = selectAll.checked);
    };
  }

  // Wire up filter cascading for dept → employee
  const twDeptSel = document.getElementById("tw-filter-dept");
  const twEmpSel  = document.getElementById("tw-filter-employee");
  if (twDeptSel && twEmpSel) {
    populateEmployeeDropdown(twDeptSel.value, twEmpSel, true);
    twDeptSel.onchange = () => {
      populateEmployeeDropdown(twDeptSel.value, twEmpSel, true);
      renderTravelHRApprove();
    };
    twEmpSel.onchange    = renderTravelHRApprove;
  }
  const twStatusSel  = document.getElementById("tw-filter-status");
  const twPurposeSel = document.getElementById("tw-filter-purpose");
  if (twStatusSel)  twStatusSel.onchange  = renderTravelHRApprove;
  if (twPurposeSel) twPurposeSel.onchange = renderTravelHRApprove;

  // Pagination controls
  if (pageEl) pageEl.onchange = renderTravelHRApprove;
  const limitEl = document.getElementById("tw-pagination-limit");
  if (limitEl) limitEl.onchange = renderTravelHRApprove;
  const wirePagBtn = (id, targetPage) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.onclick = () => { if (pageEl) { pageEl.value = targetPage; renderTravelHRApprove(); } };
  };
  wirePagBtn("tw-pagination-first", 1);
  wirePagBtn("tw-pagination-prev",  Math.max(1, safeePage - 1));
  wirePagBtn("tw-pagination-next",  Math.min(totalPages, safeePage + 1));
  wirePagBtn("tw-pagination-last",  totalPages);

  // Batch approve/reject buttons
  const batchRecommend = document.getElementById("tw-recommend-batch-btn");
  const batchApprove = document.getElementById("tw-approve-batch-btn");
  const batchReject  = document.getElementById("tw-reject-batch-btn");
  const batchRemark  = document.getElementById("tw-batch-remark");

  const getCheckedIds = () => [...document.querySelectorAll(".tw-row-checkbox:checked")].map(cb => cb.dataset.id);

  if (batchRecommend) {
    batchRecommend.onclick = () => {
      const ids = getCheckedIds();
      if (ids.length === 0) { showToast("Please select at least one record.", "error"); return; }
      const remark = (batchRemark || {}).value || "";
      ids.forEach(id => {
        const rec = state.travels.find(t => t.id === id);
        if (rec && rec.status === "Pending Recommendation") {
          rec.status = "Pending Approval";
          rec.remarks = remark || "Recommended by HOD";
          rec.actionBy = state.currentUser.name;
          
          // Send Mock Email alert to Approver (Eleanor Vance)
          const days = calculateDays(rec.startDate, rec.endDate);
          const bodyText = `Dear Approver,

${rec.staffName} has requested Travel Warrant approval (Recommended by HOD).

Day of Travel : ${days} days
From : ${formatHumanDate(rec.startDate)}
To : ${formatHumanDate(rec.endDate)}
Travel purpose : ${rec.purpose}

Please click the link to go to e-Travel Warrant system : http://localhost:3000/login.html

Regards:
[e-TravelWarrant]

Do not reply to this email. This is an auto notification from e-TravelWarrant`;

          sendMockEmail("eleanor.vance@italauto.com.my", "Eleanor Vance", `Action Required: Travel Warrant Approval for ${rec.staffName}`, bodyText);
        }
      });
      saveDatabase();
      renderTravelHRApprove();
      showToast(`${ids.length} travel warrant(s) recommended.`, "success");
      if (batchRemark) batchRemark.value = "";
    };
  }

  if (batchApprove) {
    batchApprove.onclick = () => {
      const ids = getCheckedIds();
      if (ids.length === 0) { showToast("Please select at least one record.", "error"); return; }
      const remark = (batchRemark || {}).value || "";
      ids.forEach(id => {
        const rec = state.travels.find(t => t.id === id);
        if (rec) {
          rec.status    = "Approved";
          rec.remarks   = remark || "Approved by HR";
          rec.approvedBy = state.currentUser.name;
          rec.actionBy  = state.currentUser.name;
        }
      });
      saveDatabase();
      renderTravelHRApprove();
      showToast(`${ids.length} travel warrant(s) approved.`, "success");
      if (batchRemark) batchRemark.value = "";
    };
  }

  if (batchReject) {
    batchReject.onclick = () => {
      const ids = getCheckedIds();
      if (ids.length === 0) { showToast("Please select at least one record.", "error"); return; }
      const remark = (batchRemark || {}).value || "";
      if (!remark) { showToast("Please enter a rejection reason in the Remark field.", "error"); return; }
      ids.forEach(id => {
        const rec = state.travels.find(t => t.id === id);
        if (rec) {
          rec.status   = "Rejected";
          rec.remarks  = remark;
          rec.actionBy = state.currentUser.name;
        }
      });
      saveDatabase();
      renderTravelHRApprove();
      showToast(`${ids.length} travel warrant(s) rejected.`, "info");
      if (batchRemark) batchRemark.value = "";
    };
  }
}


function renderTravelHRMy() {
  const tbody = document.getElementById("travel-hr-my-tbody");
  tbody.innerHTML = "";

  const myRequests = state.travels.filter(t => t.staffId === state.currentUser.id);

  if (myRequests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 2rem;">You have not requested any travel warrants.</td></tr>`;
  } else {
    myRequests.forEach(t => {
      const statusClass = t.status.toLowerCase();
      tbody.innerHTML += `
        <tr>
          <td>${t.id}</td>
          <td style="font-weight: 600;">${t.destination}</td>
          <td>${formatHumanDate(t.startDate)} - ${formatHumanDate(t.endDate)}</td>
          <td>${t.transport}</td>
          <td>RM ${t.costTotal || t.budget}</td>
          <td><span class="badge ${statusClass}">${t.status}</span></td>
          <td style="color: var(--text-secondary); font-style: italic;">${t.remarks || "-"}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="viewTravelWarrant('${t.id}')"><i class="fa-solid fa-file-invoice"></i> View Form</button>
          </td>
        </tr>
      `;
    });
  }
}

// ========================================================
// TRAVEL WARRANT - STAFF
// ========================================================

function renderTravelStaffDashboard() {
  const metricsContainer = document.getElementById("travel-staff-dashboard-metrics");
  const requestsTbody = document.getElementById("travel-staff-recent-requests-tbody");
  
  const myTravels = state.travels.filter(t => t.staffId === state.currentUser.id);
  const total = myTravels.length;
  const pending = myTravels.filter(t => t.status === "Pending").length;
  const approved = myTravels.filter(t => t.status === "Approved").length;
  const rejected = myTravels.filter(t => t.status === "Rejected").length;

  metricsContainer.innerHTML = `
    <div class="metric-card primary">
      <div class="metric-icon-box"><i class="fa-solid fa-file-invoice"></i></div>
      <div class="metric-details">
        <div class="metric-value">${total}</div>
        <div class="metric-label">Total Applied</div>
      </div>
    </div>
    <div class="metric-card warning">
      <div class="metric-icon-box"><i class="fa-solid fa-hourglass-half"></i></div>
      <div class="metric-details">
        <div class="metric-value">${pending}</div>
        <div class="metric-label">Pending Applied</div>
      </div>
    </div>
    <div class="metric-card success">
      <div class="metric-icon-box"><i class="fa-solid fa-check-double"></i></div>
      <div class="metric-details">
        <div class="metric-value">${approved}</div>
        <div class="metric-label">Approved Warrants</div>
      </div>
    </div>
    <div class="metric-card danger">
      <div class="metric-icon-box"><i class="fa-solid fa-times-circle"></i></div>
      <div class="metric-details">
        <div class="metric-value">${rejected}</div>
        <div class="metric-label">Rejected Warrants</div>
      </div>
    </div>
  `;

  // Personal Recent Applications Table
  requestsTbody.innerHTML = "";
  const displayTravels = [...myTravels].reverse().slice(0, 5);

  if (displayTravels.length === 0) {
    requestsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No travel warrants applied.</td></tr>`;
  } else {
    displayTravels.forEach(t => {
      const statusClass = t.status.toLowerCase();
      requestsTbody.innerHTML += `
        <tr>
          <td>${t.id}</td>
          <td style="font-weight: 600;">${t.destination}</td>
          <td>${formatHumanDate(t.startDate)}</td>
          <td>${t.purpose}</td>
          <td>${t.transport}</td>
          <td><span class="badge ${statusClass}">${t.status}</span></td>
        </tr>
      `;
    });
  }
}

function renderTravelStaffMy() {
  const tbody = document.getElementById("travel-staff-my-tbody");
  tbody.innerHTML = "";

  const myRequests = state.travels.filter(t => t.staffId === state.currentUser.id);

  if (myRequests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No travel warrants found. Use 'Apply Travel' to submit a request.</td></tr>`;
  } else {
    myRequests.forEach(t => {
      const statusClass = t.status.toLowerCase();
      tbody.innerHTML += `
        <tr>
          <td>${t.id}</td>
          <td style="font-weight: 600;">${t.destination}</td>
          <td>${formatHumanDate(t.startDate)} - ${formatHumanDate(t.endDate)}</td>
          <td>${t.transport}</td>
          <td>RM ${t.costTotal || t.budget}</td>
          <td><span class="badge ${statusClass}">${t.status}</span></td>
          <td style="color: var(--text-secondary); font-style: italic;">${t.remarks || "-"}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="viewTravelWarrant('${t.id}')"><i class="fa-solid fa-file-invoice"></i> View Form</button>
          </td>
        </tr>
      `;
    });
  }
}

// ========================================================
// E-LEAVE SYSTEM - HR
// ========================================================

function renderLeaveHRDashboard() {
  const metricsContainer = document.getElementById("leave-hr-dashboard-metrics");
  const requestsTbody = document.getElementById("leave-hr-recent-requests-tbody");
  
  const allLeaves = state.leaves;
  const total = allLeaves.length;
  const pending = allLeaves.filter(l => l.status === "Pending").length;
  const approved = allLeaves.filter(l => l.status === "Approved").length;

  // On Leave Today Calculations
  const todayStr = state.currentCalendarDate.toISOString().split('T')[0]; // June 8, 2026
  const onLeaveTodayCount = allLeaves.filter(l => {
    return l.status === "Approved" && todayStr >= l.startDate && todayStr <= l.endDate;
  }).length;

  metricsContainer.innerHTML = `
    <div class="metric-card primary">
      <div class="metric-icon-box"><i class="fa-solid fa-receipt"></i></div>
      <div class="metric-details">
        <div class="metric-value">${total}</div>
        <div class="metric-label">Total Applications</div>
      </div>
    </div>
    <div class="metric-card warning">
      <div class="metric-icon-box"><i class="fa-solid fa-hourglass-half"></i></div>
      <div class="metric-details">
        <div class="metric-value">${pending}</div>
        <div class="metric-label">Pending Review</div>
      </div>
    </div>
    <div class="metric-card success">
      <div class="metric-icon-box"><i class="fa-solid fa-circle-check"></i></div>
      <div class="metric-details">
        <div class="metric-value">${approved}</div>
        <div class="metric-label">Approved Leaves</div>
      </div>
    </div>
    <div class="metric-card info">
      <div class="metric-icon-box"><i class="fa-solid fa-door-open"></i></div>
      <div class="metric-details">
        <div class="metric-value">${onLeaveTodayCount}</div>
        <div class="metric-label">On Leave Today</div>
      </div>
    </div>
  `;

  // Recent Leave Table (limit 5)
  requestsTbody.innerHTML = "";
  const displayLeaves = [...allLeaves].reverse().slice(0, 5);

  if (displayLeaves.length === 0) {
    requestsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No leaves recorded.</td></tr>`;
  } else {
    displayLeaves.forEach(l => {
      const statusClass = l.status.toLowerCase();
      requestsTbody.innerHTML += `
        <tr>
          <td>${l.staffId}</td>
          <td style="font-weight: 600;">${l.staffName}</td>
          <td>${l.leaveType}</td>
          <td>${formatHumanDate(l.startDate)} - ${formatHumanDate(l.endDate)}</td>
          <td><span class="badge ${statusClass}">${l.status}</span></td>
        </tr>
      `;
    });
  }

  // Render HR Master Leave Calendar
  renderHRCalendar();
}

function renderHRCalendar() {
  const container = document.getElementById("calendar-hr-days-grid");
  const monthYearEl = document.getElementById("calendar-hr-month-year");
  
  const m = state.activeCalendarMonth;
  const y = state.activeCalendarYear;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthYearEl.textContent = `${monthNames[m]} ${y}`;

  container.innerHTML = "";

  const firstDayIndex = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();

  // Empty cells for alignment
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    container.appendChild(emptyCell);
  }

  // Active Days loop
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    
    // Check if day matches 'today' (June 8, 2026)
    if (y === 2026 && m === 5 && day === 8) {
      dayCell.classList.add("today");
    }

    dayCell.innerHTML = `<span class="calendar-day-number">${day}</span>`;
    
    // Search leaves occurring on this calendar day (must be Approved)
    const dayDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const activeLeaves = state.leaves.filter(l => {
      return l.status === "Approved" && dayDateStr >= l.startDate && dayDateStr <= l.endDate;
    });

    if (activeLeaves.length > 0) {
      const eventsContainer = document.createElement("div");
      eventsContainer.className = "calendar-day-events";
      
      activeLeaves.forEach(l => {
        let typeClass = "annual";
        if (l.leaveType === "Sick Leave") typeClass = "sick";
        if (l.leaveType === "Emergency Leave") typeClass = "emergency";

        const nameInitial = l.staffName.split(" ")[0]; // e.g. "Sophia"
        const dot = document.createElement("div");
        dot.className = `calendar-event-dot ${typeClass}`;
        dot.textContent = nameInitial;
        dot.title = `${l.staffName}: ${l.leaveType}`;
        eventsContainer.appendChild(dot);
      });
      dayCell.appendChild(eventsContainer);
    }

    container.appendChild(dayCell);
  }
}

function formatTableDate(dateStr) {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function getMockApprovers(staffId) {
  const user = state.users[staffId];
  if (!user) return "Eleanor Vance";
  const dept = user.department;
  if (dept === "Engineering") return "Owen Chen &raquo; Eleanor Vance";
  if (dept === "Design") return "Liam Hudson &raquo; Eleanor Vance";
  if (dept === "Operations") return "Ahmad Ferrari &raquo; Eleanor Vance";
  return "Carter Logan &raquo; Eleanor Vance";
}

function toggleExpandLeaveRow(leaveId) {
  const detailRowId = `leave-detail-row-${leaveId}`;
  const btnId = `leave-expand-btn-${leaveId}`;
  const detailRow = document.getElementById(detailRowId);
  const btn = document.getElementById(btnId);
  
  if (detailRow && btn) {
    if (detailRow.classList.contains("hidden")) {
      detailRow.classList.remove("hidden");
      btn.textContent = "−";
    } else {
      detailRow.classList.add("hidden");
      btn.textContent = "+";
    }
  }
}

function toggleExpandTravelRow(travelId) {
  const detailRowId = `tw-detail-row-${travelId}`;
  const btnId = `tw-expand-btn-${travelId}`;
  const detailRow = document.getElementById(detailRowId);
  const btn = document.getElementById(btnId);
  
  if (detailRow && btn) {
    if (detailRow.classList.contains("hidden")) {
      detailRow.classList.remove("hidden");
      btn.textContent = "−";
    } else {
      detailRow.classList.add("hidden");
      btn.textContent = "+";
    }
  }
}

function setupApproveFilters() {
  const deptSelect = document.getElementById("approve-filter-dept");
  const empSelect = document.getElementById("approve-filter-employee");
  const typeSelect = document.getElementById("approve-filter-type");
  
  deptSelect.onchange = () => {
    populateApproveEmployees();
    state.approveCurrentPage = 1;
    renderLeaveHRApprove();
  };
  
  empSelect.onchange = () => {
    state.approveCurrentPage = 1;
    renderLeaveHRApprove();
  };
  
  typeSelect.onchange = () => {
    state.approveCurrentPage = 1;
    renderLeaveHRApprove();
  };
  
  document.getElementById("approve-batch-btn").onclick = () => handleBatchAction("approve");
  document.getElementById("reject-batch-btn").onclick = () => handleBatchAction("reject");
  const recBtn = document.getElementById("recommend-batch-btn");
  if (recBtn) recBtn.onclick = () => handleBatchAction("recommend");
  
  populateApproveEmployees();
}

function populateApproveEmployees() {
  const deptSelect = document.getElementById("approve-filter-dept");
  const empSelect = document.getElementById("approve-filter-employee");
  const selectedDept = deptSelect.value;
  
  empSelect.innerHTML = `<option value="- ALL -">- ALL -</option>`;
  
  const filteredUsers = Object.values(state.users).filter(user => {
    if (selectedDept === "- ALL -") return true;
    return user.department === selectedDept;
  });
  
  filteredUsers.forEach(user => {
    const opt = document.createElement("option");
    opt.value = user.id;
    opt.textContent = `${user.name} [${user.id}]`;
    empSelect.appendChild(opt);
  });
}

function handleBatchAction(actionType) {
  const checkedBoxes = document.querySelectorAll(".approve-row-checkbox:checked");
  if (checkedBoxes.length === 0) {
    showToast("Please check at least one leave application.", "error");
    return;
  }
  
  const remarkInput = document.getElementById("approve-batch-remark");
  const remark = remarkInput.value.trim();
  
  if (actionType === "reject" && !remark) {
    showToast("Remark/Reason is required for rejections.", "error");
    return;
  }
  
  let processedCount = 0;
  
  checkedBoxes.forEach(cb => {
    const leaveId = cb.getAttribute("data-id");
    const leave = state.leaves.find(l => l.id === leaveId);
    if (!leave) return;
    
    if (actionType === "recommend") {
      if (leave.status === "Pending Recommendation") {
        leave.status = "Pending Approval";
        leave.remarks = remark || "Recommended by HOD";
        leave.lastActionBy = state.currentUser.name;
        
        // Send Mock Email alert to Approver (Eleanor Vance)
        const bodyText = `Dear Approver,

${leave.staffName} has requested E-Leave approval (Recommended by HOD).

Leave Type : ${leave.leaveType}
From : ${formatHumanDate(leave.startDate)}
To : ${formatHumanDate(leave.endDate)}
Total Days : ${leave.totalDays} Days
Reason : ${leave.reason}

Please click the link to go to e-Leave system : http://localhost:3000/login.html

Regards:
[e-Leave]

Do not reply to this email. This is an auto notification from e-Leave`;

        sendMockEmail("eleanor.vance@italauto.com.my", "Eleanor Vance", `Action Required: Leave Approval for ${leave.staffName}`, bodyText);
        processedCount++;
      }
    } else if (actionType === "approve") {
      const applicant = state.users[leave.staffId];
      if (applicant) {
        const leaveTypeKey = leave.leaveType.toUpperCase();
        const bal = applicant.leaveBalances[leaveTypeKey] !== undefined 
          ? applicant.leaveBalances[leaveTypeKey] 
          : (applicant.leaveBalances[leave.leaveType] || 0);
          
        if (bal >= leave.totalDays) {
          if (applicant.leaveBalances[leaveTypeKey] !== undefined) {
            applicant.leaveBalances[leaveTypeKey] = bal - leave.totalDays;
          } else {
            applicant.leaveBalances[leave.leaveType] = bal - leave.totalDays;
          }
          
          if (applicant.leaveStats && applicant.leaveStats[leaveTypeKey]) {
            applicant.leaveStats[leaveTypeKey].taken = (applicant.leaveStats[leaveTypeKey].taken || 0) + leave.totalDays;
          }
          
          leave.status = "Approved";
          leave.remarks = remark || "Approved by HR Batch Action";
          processedCount++;
        } else {
          showToast(`Cannot approve leave for ${leave.staffName}. Insufficient balance.`, "error");
        }
      }
    } else {
      leave.status = "Rejected";
      leave.remarks = remark;
      processedCount++;
    }
  });
  
  if (processedCount > 0) {
    saveDatabase();
    remarkInput.value = "";
    document.getElementById("approve-select-all").checked = false;
    showToast(`Successfully processed ${processedCount} leave applications!`);
    triggerConfetti();
    renderLeaveHRApprove();
  }
}

function renderLeaveHRApprove() {
  if (!state.approveFiltersInitialized) {
    setupApproveFilters();
    state.approveFiltersInitialized = true;
  }
  
  if (state.approveCurrentPage === undefined) state.approveCurrentPage = 1;
  if (state.approveLimit === undefined) state.approveLimit = 100;
  
  const deptFilter = document.getElementById("approve-filter-dept").value;
  const empFilter = document.getElementById("approve-filter-employee").value;
  const typeFilter = document.getElementById("approve-filter-type").value;
  
  const tbody = document.getElementById("leave-hr-approve-tbody");
  tbody.innerHTML = "";
  
  // HR can approve all leave except their own requests
  let requests = state.leaves.filter(l => (l.status === "Pending" || l.status === "Pending Recommendation" || l.status === "Pending Approval") && l.staffId !== state.currentUser.id);
  
  // Apply Filters
  if (deptFilter !== "- ALL -") {
    requests = requests.filter(l => {
      const u = state.users[l.staffId];
      return u && u.department === deptFilter;
    });
  }
  if (empFilter !== "- ALL -") {
    requests = requests.filter(l => l.staffId === empFilter);
  }
  if (typeFilter !== "- ALL -") {
    requests = requests.filter(l => l.leaveType.toUpperCase() === typeFilter.toUpperCase());
  }
  
  // Pagination Math
  const totalRecords = requests.length;
  const totalPages = Math.ceil(totalRecords / state.approveLimit) || 1;
  
  if (state.approveCurrentPage > totalPages) {
    state.approveCurrentPage = totalPages;
  }
  
  const startIdx = (state.approveCurrentPage - 1) * state.approveLimit;
  const endIdx = startIdx + state.approveLimit;
  const pageRequests = requests.slice(startIdx, endIdx);
  
  if (pageRequests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="18" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No pending leave applications found matching filters.</td></tr>`;
  } else {
    pageRequests.forEach(l => {
      const statusClass = l.status === "Approved" ? "approved" : l.status === "Rejected" ? "rejected" : "pending";
      tbody.innerHTML += `
        <tr class="approve-leave-row" id="leave-row-${l.id}">
          <td>
            <span class="expand-row-btn" id="leave-expand-btn-${l.id}" onclick="toggleExpandLeaveRow('${l.id}')">+</span>
            <input type="checkbox" class="approve-row-checkbox" data-id="${l.id}" style="margin-right: 8px; vertical-align: middle;">
            <a class="view-link" onclick="viewLeaveApplication('${l.id}')"><i class="fa-solid fa-eye" style="margin-right:3px;"></i>View</a>
          </td>
          <td><span class="badge ${statusClass}">${l.status}</span></td>
          <td>${l.staffId}</td>
          <td style="font-weight: 600;">${l.staffName}</td>
          <td>${l.leaveType.toUpperCase()}</td>
          <td>${formatTableDate(l.startDate)}</td>
          <td>${formatTableDate(l.endDate)}</td>
          <td>${l.totalDays}</td>
          <td>${l.ampm || ""}</td>
          <td>${l.reason || ""}</td>
          <td>${l.referenceNo || ""}</td>
          <td>${l.staffName}</td>
          <td>${formatTableDate(l.dateApplied)}</td>
          <td>${l.lastActionBy || ""}</td>
          <td>${l.rejectedReason || ""}</td>
          <td>${l.actionDate || ""}</td>
          <td>${l.attachment || ""}</td>
          <td>${l.approvers || getMockApprovers(l.staffId)}</td>
        </tr>
        <tr class="expanded-detail-row hidden" id="leave-detail-row-${l.id}">
          <td colspan="18">
            <div class="expanded-detail-container">
              <strong>Employee ID:</strong> ${l.staffId} | 
              <strong>Role:</strong> ${state.users[l.staffId]?.role || "Staff"} | 
              <strong>Department:</strong> ${state.users[l.staffId]?.department || "Operations"} <br>
              <strong>Leave Duration:</strong> ${formatHumanDate(l.startDate)} to ${formatHumanDate(l.endDate)} (${l.totalDays} Days) <br>
              <strong>Reason Details:</strong> ${l.reason || "No reason specified."} <br>
              <strong>Approver chain hierarchy:</strong> ${l.approvers || getMockApprovers(l.staffId)}
            </div>
          </td>
        </tr>
      `;
    });
  }
  
  // Update Pagination Controls in DOM
  const firstBtn = document.getElementById("pagination-first");
  const prevBtn = document.getElementById("pagination-prev");
  const nextBtn = document.getElementById("pagination-next");
  const lastBtn = document.getElementById("pagination-last");
  
  if (state.approveCurrentPage === 1) {
    firstBtn.classList.add("disabled");
    prevBtn.classList.add("disabled");
  } else {
    firstBtn.classList.remove("disabled");
    prevBtn.classList.remove("disabled");
  }
  
  if (state.approveCurrentPage === totalPages) {
    nextBtn.classList.add("disabled");
    lastBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
    lastBtn.classList.remove("disabled");
  }
  
  firstBtn.onclick = () => {
    state.approveCurrentPage = 1;
    renderLeaveHRApprove();
  };
  
  prevBtn.onclick = () => {
    if (state.approveCurrentPage > 1) {
      state.approveCurrentPage--;
      renderLeaveHRApprove();
    }
  };
  
  nextBtn.onclick = () => {
    if (state.approveCurrentPage < totalPages) {
      state.approveCurrentPage++;
      renderLeaveHRApprove();
    }
  };
  
  lastBtn.onclick = () => {
    state.approveCurrentPage = totalPages;
    renderLeaveHRApprove();
  };
  
  document.getElementById("approve-pagination-limit").value = state.approveLimit;
  document.getElementById("approve-pagination-limit").onchange = (e) => {
    state.approveLimit = parseInt(e.target.value);
    state.approveCurrentPage = 1;
    renderLeaveHRApprove();
  };
  
  const pageSelect = document.getElementById("approve-pagination-page");
  pageSelect.innerHTML = "";
  for (let p = 1; p <= totalPages; p++) {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    if (p === state.approveCurrentPage) opt.selected = true;
    pageSelect.appendChild(opt);
  }
  pageSelect.onchange = (e) => {
    state.approveCurrentPage = parseInt(e.target.value);
    renderLeaveHRApprove();
  };
  
  document.getElementById("approve-pagination-total-pages").textContent = totalPages;
  
  // Bind select all checkbox toggle
  const selectAllCb = document.getElementById("approve-select-all");
  selectAllCb.checked = false; // Reset to unchecked on redraw
  selectAllCb.onchange = () => {
    const isChecked = selectAllCb.checked;
    document.querySelectorAll(".approve-row-checkbox").forEach(cb => {
      cb.checked = isChecked;
    });
  };
}

function renderLeaveHRMy() {
  const tbody = document.getElementById("leave-hr-my-tbody");
  tbody.innerHTML = "";

  const myLeaves = state.leaves.filter(l => l.staffId === state.currentUser.id);

  if (myLeaves.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">You have not submitted any leave requests.</td></tr>`;
  } else {
    myLeaves.forEach(l => {
      const statusClass = l.status.toLowerCase();
      tbody.innerHTML += `
        <tr>
          <td>${l.id}</td>
          <td style="font-weight: 600;">${l.leaveType}</td>
          <td>${formatHumanDate(l.startDate)} - ${formatHumanDate(l.endDate)} (${l.totalDays} Days)</td>
          <td>${l.reliefStaff}</td>
          <td><span class="badge ${statusClass}">${l.status}</span></td>
          <td style="color: var(--text-secondary); font-style: italic;">${l.remarks || "-"}</td>
        </tr>
      `;
    });
  }
}

// ========================================================
// E-LEAVE SYSTEM - HR REPORTS
// ========================================================

const LEAVE_TYPES = [
  "ABSENT",
  "ANNUAL LEAVE",
  "COMPASSIONATE LEAVE",
  "EMERGENCY LEAVE",
  "EXAMINATION LEAVE",
  "HOSPITALISATION",
  "LEAVE IN LIEU",
  "MARRIAGE LEAVE",
  "MATERNITY LEAVE",
  "NO PAY LEAVE DAY",
  "NO PAY LEAVE HOUR",
  "PATERNITY",
  "REPLACEMENT LEAVE",
  "SICK LEAVE"
];

function initLeaveReportPage() {
  if (!state.leaveReportInitialized) {
    const typeSelect = document.getElementById("report-filter-type");
    const monthRow = document.getElementById("report-month-row");
    const monthSelect = document.getElementById("report-filter-month");
    const yearSelect = document.getElementById("report-filter-year");
    const deptSelect = document.getElementById("report-filter-dept");
    const empSelect = document.getElementById("report-filter-employee");
    const leaveTypeSelect = document.getElementById("report-filter-leave-type");
    const generateBtn = document.getElementById("generate-report-btn");
    const exportBtn = document.getElementById("export-report-csv-btn");
    const printBtn = document.getElementById("print-report-btn");
    
    typeSelect.addEventListener("change", () => {
      if (typeSelect.value === "yearly") {
        monthRow.classList.add("hidden");
      } else {
        monthRow.classList.remove("hidden");
      }
      generateLeaveReport();
    });
    
    monthSelect.addEventListener("change", generateLeaveReport);
    yearSelect.addEventListener("change", generateLeaveReport);
    deptSelect.addEventListener("change", () => {
      populateReportEmployees();
      generateLeaveReport();
    });
    empSelect.addEventListener("change", generateLeaveReport);
    leaveTypeSelect.addEventListener("change", generateLeaveReport);
    
    if (generateBtn) {
      generateBtn.addEventListener("click", generateLeaveReport);
    }
    exportBtn.addEventListener("click", exportReportToCSV);
    printBtn.addEventListener("click", printLeaveReport);
    
    const pdfBtn = document.getElementById("export-report-pdf-btn");
    const xlsBtn = document.getElementById("export-report-xls-btn");
    if (pdfBtn) pdfBtn.addEventListener("click", exportReportToPDF);
    if (xlsBtn) xlsBtn.addEventListener("click", exportReportToXLS);
    
    // Set initial default date values to current month/year
    const today = new Date();
    monthSelect.value = today.getMonth();
    
    const currentYear = today.getFullYear().toString();
    if (Array.from(yearSelect.options).some(opt => opt.value === currentYear)) {
      yearSelect.value = currentYear;
    } else {
      yearSelect.value = "2026";
    }
    
    deptSelect.value = "- ALL -";
    leaveTypeSelect.value = "- ALL -";
    
    state.leaveReportInitialized = true;
  }
  
  populateReportEmployees();
  generateLeaveReport();
}

function populateReportEmployees() {
  const deptSelect = document.getElementById("report-filter-dept");
  const empSelect = document.getElementById("report-filter-employee");
  if (!deptSelect || !empSelect) return;
  const selectedDept = deptSelect.value;
  
  const currentSelection = empSelect.value;
  empSelect.innerHTML = `<option value="- ALL -">- ALL -</option>`;
  
  const filteredUsers = Object.values(state.users).filter(user => {
    if (selectedDept === "- ALL -") return true;
    return user.department === selectedDept;
  });
  
  filteredUsers.forEach(user => {
    const opt = document.createElement("option");
    opt.value = user.id;
    opt.textContent = `${user.name} [${user.id}]`;
    empSelect.appendChild(opt);
  });

  if (Array.from(empSelect.options).some(opt => opt.value === currentSelection)) {
    empSelect.value = currentSelection;
  } else {
    empSelect.value = "- ALL -";
  }
}

function generateLeaveReport() {
  const reportType = document.getElementById("report-filter-type").value;
  const monthSelect = document.getElementById("report-filter-month");
  const monthVal = parseInt(monthSelect.value, 10);
  const yearVal = document.getElementById("report-filter-year").value;
  const deptFilter = document.getElementById("report-filter-dept").value;
  const empFilter = document.getElementById("report-filter-employee").value;
  const typeFilter = document.getElementById("report-filter-leave-type").value;
  
  let filtered = state.leaves;
  
  // Apply date filter
  filtered = filtered.filter(l => {
    if (!l.startDate) return false;
    const parts = l.startDate.split("-");
    if (parts.length !== 3) return false;
    
    const yearMatches = parts[0] === yearVal;
    if (!yearMatches) return false;
    
    if (reportType === "monthly") {
      const monthMatches = (parseInt(parts[1], 10) - 1) === monthVal;
      return monthMatches;
    }
    return true;
  });
  
  // Apply department filter
  if (deptFilter !== "- ALL -") {
    filtered = filtered.filter(l => {
      const u = state.users[l.staffId];
      return u && u.department === deptFilter;
    });
  }
  
  // Apply employee filter
  if (empFilter !== "- ALL -") {
    filtered = filtered.filter(l => l.staffId === empFilter);
  }
  
  // Apply leave type filter
  if (typeFilter !== "- ALL -") {
    filtered = filtered.filter(l => l.leaveType.toUpperCase() === typeFilter.toUpperCase());
  }
  
  state.filteredReportLeaves = filtered;
  
  // Compute KPIs
  const approvedLeaves = filtered.filter(l => l.status === "Approved");
  const totalDays = approvedLeaves.reduce((sum, l) => sum + parseFloat(l.totalDays || 0), 0);
  const approvedCount = approvedLeaves.length;
  const pendingCount = filtered.filter(l => l.status === "Pending").length;
  
  const typeCounts = {};
  filtered.forEach(l => {
    const t = l.leaveType.toUpperCase();
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  let topType = "-";
  let maxCount = 0;
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topType = type;
    }
  }
  
  document.getElementById("report-kpi-days").textContent = totalDays;
  document.getElementById("report-kpi-approved").textContent = approvedCount;
  document.getElementById("report-kpi-pending").textContent = pendingCount;
  document.getElementById("report-kpi-top-type").textContent = topType;
  
  // Visual distribution
  const daysByType = {};
  LEAVE_TYPES.forEach(t => daysByType[t] = 0);
  approvedLeaves.forEach(l => {
    const t = l.leaveType.toUpperCase();
    if (daysByType[t] !== undefined) {
      daysByType[t] += parseFloat(l.totalDays || 0);
    } else {
      daysByType[t] = parseFloat(l.totalDays || 0);
    }
  });
  
  const maxDays = Math.max(...Object.values(daysByType), 0);
  const activeTypes = Object.entries(daysByType)
    .filter(([type, days]) => days > 0)
    .sort((a, b) => b[1] - a[1]);
    
  const barsContainer = document.getElementById("report-distribution-bars");
  if (activeTypes.length === 0) {
    barsContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 1.5rem 0;">No approved leave distribution data for this period.</div>`;
  } else {
    let barsHTML = "";
    activeTypes.forEach(([type, days]) => {
      const percent = maxDays > 0 ? (days / maxDays) * 100 : 0;
      barsHTML += `
        <div class="distribution-bar-row">
          <div class="distribution-bar-label">${type}</div>
          <div class="distribution-bar-track">
            <div class="distribution-bar-fill" style="width: ${percent}%"></div>
          </div>
          <div class="distribution-bar-val">${days} Day${days !== 1 ? 's' : ''}</div>
        </div>
      `;
    });
    barsContainer.innerHTML = barsHTML;
  }
  
  // Render grid table details
  const detailsTbody = document.getElementById("report-details-tbody");
  if (filtered.length === 0) {
    detailsTbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No leave applications found matching the selected filters.</td></tr>`;
  } else {
    let detailsHTML = "";
    filtered.forEach(l => {
      const statusClass = l.status.toLowerCase();
      const statusBadge = `<span class="badge ${statusClass}">${l.status}</span>`;
      detailsHTML += `
        <tr>
          <td>${l.id}</td>
          <td>${l.staffId}</td>
          <td style="font-weight: 600;">${l.staffName}</td>
          <td>${l.leaveType.toUpperCase()}</td>
          <td>${formatTableDate(l.startDate)}</td>
          <td>${formatTableDate(l.endDate)}</td>
          <td>${l.totalDays}</td>
          <td>${statusBadge}</td>
          <td>${l.referenceNo || "-"}</td>
          <td>${l.reason || "-"}</td>
        </tr>
      `;
    });
    detailsTbody.innerHTML = detailsHTML;
  }
  
  document.getElementById("report-results-container").classList.remove("hidden");
}

function exportReportToCSV() {
  const leavesToExport = state.filteredReportLeaves || [];
  if (leavesToExport.length === 0) {
    showToast("No data to export", "warning");
    return;
  }
  
  let csvRows = [];
  csvRows.push("Ref ID,Emp ID,Employee Name,Leave Type,Start Date,End Date,Total Days,Status,Reference No,Reason");
  
  leavesToExport.forEach(l => {
    const row = [
      l.id,
      l.staffId,
      `"${(l.staffName || "").replace(/"/g, '""')}"`,
      (l.leaveType || "").toUpperCase(),
      formatTableDate(l.startDate),
      formatTableDate(l.endDate),
      l.totalDays,
      l.status,
      `"${(l.referenceNo || "").replace(/"/g, '""')}"`,
      `"${(l.reason || "").replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(","));
  });
  
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  
  const reportType = document.getElementById("report-filter-type").value;
  const year = document.getElementById("report-filter-year").value;
  let filename = `Leave_Report_${year}`;
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    filename += `_${monthName}`;
  }
  
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showToast("CSV report exported successfully!", "success");
}

function _getReportFilename() {
  const reportType = document.getElementById("report-filter-type").value;
  const year = document.getElementById("report-filter-year").value;
  let filename = `Leave_Report_${year}`;
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    filename += `_${monthName}`;
  }
  return filename;
}

function _getReportSubtitle() {
  const reportType = document.getElementById("report-filter-type").value;
  const year = document.getElementById("report-filter-year").value;
  let subtitleText = "";
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    subtitleText = `Monthly Report - ${monthName} ${year}`;
  } else {
    subtitleText = `Yearly Report - ${year}`;
  }
  const dept = document.getElementById("report-filter-dept").value;
  const empSelect = document.getElementById("report-filter-employee");
  const empName = empSelect.options[empSelect.selectedIndex]?.text || "- ALL -";
  const leaveType = document.getElementById("report-filter-leave-type").value;
  let filtersText = [];
  if (dept !== "- ALL -") filtersText.push(`Dept: ${dept}`);
  if (empSelect.value !== "- ALL -") filtersText.push(`Employee: ${empName}`);
  if (leaveType !== "- ALL -") filtersText.push(`Leave Type: ${leaveType}`);
  if (filtersText.length > 0) subtitleText += ` | ${filtersText.join(" | ")}`;
  return subtitleText;
}

// ==========================================
// LEAVE APPLICATION PDF
// ==========================================

function generateLeavePDF(leaveId) {
  if (!window.jspdf) { showToast("PDF library not loaded.", "error"); return; }
  const { jsPDF } = window.jspdf;

  const l = state.leaves.find(x => x.id === leaveId);
  if (!l) { showToast("Leave record not found.", "error"); return; }

  const u = state.users[l.staffId] || {};
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210; const ml = 18; const mr = 18; const cw = W - ml - mr;

  // ── Maroon header bar ──
  doc.setFillColor(128, 0, 0);
  doc.rect(0, 0, W, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(15);
  doc.text("ITAL AUTO SDN BHD", ml, 11);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Human Resource Management System – Leave Application", ml, 18);
  doc.text(`Ref: ${l.id}`, W - mr - 2, 18, { align: "right" });
  doc.setFontSize(7.5);
  doc.text(`Generated: ${new Date().toLocaleString()}`, W - mr - 2, 24, { align: "right" });

  // ── Grey separator ──
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(ml, 32, W - mr, 32);

  // ── Section: Applicant Details ──
  let y = 38;
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.setTextColor(128, 0, 0);
  doc.text("APPLICANT DETAILS", ml, y); y += 6;
  doc.setDrawColor(128, 0, 0); doc.setLineWidth(0.5);
  doc.line(ml, y, W - mr, y); y += 5;

  doc.setTextColor(40, 40, 40); doc.setFontSize(9);
  const col2 = ml + cw / 2;

  const labelValue = (lbl, val, xPos, yPos) => {
    doc.setFont("helvetica", "bold"); doc.text(lbl + ":", xPos, yPos);
    doc.setFont("helvetica", "normal"); doc.text(String(val || "-"), xPos + 38, yPos);
  };

  labelValue("Employee Name",  l.staffName,        ml,   y);
  labelValue("Employee ID",    l.staffId,           col2, y); y += 6;
  labelValue("Position",       u.role || "-",       ml,   y);
  labelValue("Department",     u.department || "-", col2, y); y += 6;
  labelValue("Date Applied",   l.dateApplied,       ml,   y);
  labelValue("Reference No",   l.referenceNo || "-",col2, y); y += 8;

  // ── Section: Leave Details ──
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.setTextColor(128, 0, 0);
  doc.text("LEAVE DETAILS", ml, y); y += 6;
  doc.setDrawColor(128, 0, 0); doc.setLineWidth(0.5);
  doc.line(ml, y, W - mr, y); y += 3;

  doc.autoTable({
    startY: y,
    head: [["Field", "Details"]],
    body: [
      ["Leave Type",   l.leaveType || "-"],
      ["Start Date",   formatHumanDate(l.startDate)],
      ["End Date",     formatHumanDate(l.endDate)],
      ["Total Days",   String(l.totalDays)],
      ["AM / PM",      l.ampm || "Full Day"],
      ["Reason",       l.reason || "-"],
      ["Relief Staff", l.reliefStaff || "-"],
      ["Approvers",    l.approvers || getMockApprovers(l.staffId)],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [128, 0, 0], textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" }, 1: { cellWidth: "auto" } },
    alternateRowStyles: { fillColor: [252, 245, 245] },
    margin: { left: ml, right: mr },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ── Status banner ──
  const statusColor = l.status === "Approved" ? [0, 128, 64] : l.status === "Rejected" ? [180, 20, 20] : [180, 100, 0];
  doc.setFillColor(...statusColor);
  doc.roundedRect(ml, y, cw, 9, 2, 2, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
  doc.text(`STATUS: ${l.status.toUpperCase()}${l.remarks ? "  |  " + l.remarks : ""}`, W / 2, y + 6, { align: "center" });
  y += 17;

  // ── Signature block ──
  doc.setTextColor(40, 40, 40); doc.setFontSize(8.5); doc.setFont("helvetica", "normal");
  const sigW = (cw - 10) / 3;
  ["Applicant", "HR / Verified By", "Approved By"].forEach((lbl, i) => {
    const sx = ml + i * (sigW + 5);
    doc.setDrawColor(120, 120, 120); doc.setLineWidth(0.3);
    doc.line(sx, y + 14, sx + sigW, y + 14);
    doc.text(lbl, sx + sigW / 2, y + 19, { align: "center" });
    doc.text("Name: _______________", sx, y + 24);
    doc.text("Date:  _______________", sx, y + 30);
  });

  // ── Footer ──
  doc.setFontSize(7); doc.setTextColor(150);
  doc.text("Ital Auto HRMS  |  Confidential – For Internal Use Only", W / 2, 287, { align: "center" });

  doc.output("dataurlnewwindow");
  showToast("Leave PDF opened in new tab.", "success");
}

// ==========================================
// TRAVEL WARRANT PDF
// ==========================================

function generateTravelPDF(travelId) {
  if (!window.jspdf) { showToast("PDF library not loaded.", "error"); return; }
  const { jsPDF } = window.jspdf;

  const t = state.travels.find(x => x.id === travelId);
  if (!t) { showToast("Travel record not found.", "error"); return; }

  const u = state.users[t.staffId] || {};
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297; const H = 210; const ml = 18; const mr = 18; const cw = W - ml - mr;

  // ── Maroon header ──
  doc.setFillColor(128, 0, 0);
  doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  doc.text("ITAL AUTO SDN BHD", ml, 10);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Human Resource Management System – Travel Warrant Application", ml, 17);
  doc.text(`Ref: ${t.id}   |   Generated: ${new Date().toLocaleString()}`, W - mr - 2, 17, { align: "right" });

  doc.setDrawColor(180); doc.setLineWidth(0.3);
  doc.line(ml, 30, W - mr, 30);

  let y = 36;

  // ── Employee Details ──
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.setTextColor(128, 0, 0);
  doc.text("EMPLOYEE DETAILS", ml, y); y += 5;
  doc.setDrawColor(128, 0, 0); doc.setLineWidth(0.5);
  doc.line(ml, y, W - mr, y); y += 5;

  doc.setTextColor(40, 40, 40); doc.setFontSize(8.5);
  const col2 = ml + cw / 3; const col3 = ml + 2 * (cw / 3);
  const lv = (lbl, val, x, yy) => {
    doc.setFont("helvetica", "bold"); doc.text(lbl + ":", x, yy);
    doc.setFont("helvetica", "normal"); doc.text(String(val || "-"), x + 30, yy);
  };
  lv("Name", t.staffName, ml, y); lv("ID", t.staffId, col2, y); lv("Position", u.role || t.role || "-", col3, y); y += 5;
  lv("Dept", t.divDept || u.department || "-", ml, y); lv("Branch", t.branch || "Ital Auto Malaysia", col2, y); lv("Job Grade", t.jobGrade || "-", col3, y); y += 8;

  // ── Travel Details ──
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.setTextColor(128, 0, 0);
  doc.text("TRAVELLING DETAILS", ml, y); y += 5;
  doc.setDrawColor(128, 0, 0); doc.setLineWidth(0.5);
  doc.line(ml, y, W - mr, y); y += 3;

  doc.autoTable({
    startY: y,
    head: [["#", "Field", "Details", "#", "Field", "Details"]],
    body: [
      ["1", "Destination",     t.destination || "-",       "4", "Return Date",     formatHumanDate(t.endDate)],
      ["2", "Departure Date",  formatHumanDate(t.startDate),"5", "Mode of Travel",  t.transport || "-"],
      ["3", "Departure Time",  t.deptTime || "-",           "6", "Purpose",         t.purpose || "-"],
    ],
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [128, 0, 0], textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 8 }, 1: { cellWidth: 40 }, 2: { cellWidth: 65 }, 3: { cellWidth: 8 }, 4: { cellWidth: 40 }, 5: { cellWidth: "auto" } },
    alternateRowStyles: { fillColor: [252, 245, 245] },
    margin: { left: ml, right: mr },
  });

  y = doc.lastAutoTable.finalY + 5;

  // ── Cost Breakdown ──
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.setTextColor(128, 0, 0);
  doc.text("ESTIMATED COST (RM)", ml, y); y += 5;
  doc.setDrawColor(128, 0, 0); doc.setLineWidth(0.5);
  doc.line(ml, y, W - mr, y); y += 3;

  const rmFmt = (v) => `RM ${parseFloat(v || 0).toFixed(2)}`;
  doc.autoTable({
    startY: y,
    head: [["Expense", "Details / Calculation", "Amount (RM)"]],
    body: [
      ["Lodging",       `${t.lodgingRate || 0}/day × ${t.lodgingDays || 0} days`, rmFmt(t.lodgingTotal)],
      ["Mileage",       "-",                                                        rmFmt(t.mileage)],
      ["Fuel",          "-",                                                        rmFmt(t.fuel)],
      ["Toll",          "-",                                                        rmFmt(t.toll)],
      ["Airfares",      "-",                                                        rmFmt(t.airfares)],
      ["Subsistence",   `${t.subsistenceRate || 0}/day × ${t.subsistenceDays || 0} days`, rmFmt(t.subsistenceTotal)],
      ["Entertainment", t.entDetail || "-",                                         rmFmt(t.entTotal)],
      ["TOTAL",         "",                                                         rmFmt(t.costTotal || t.budget)],
    ],
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [128, 0, 0], textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: "auto" }, 2: { cellWidth: 35, halign: "right" } },
    alternateRowStyles: { fillColor: [252, 245, 245] },
    bodyStyles: { },
    didParseCell: (data) => {
      if (data.row.index === 7) { data.cell.styles.fontStyle = "bold"; data.cell.styles.fillColor = [220, 200, 200]; }
    },
    margin: { left: ml, right: mr },
  });

  y = doc.lastAutoTable.finalY + 5;

  // ── Status banner ──
  const sc = t.status === "Approved" ? [0, 128, 64] : t.status === "Rejected" ? [180, 20, 20] : [180, 100, 0];
  doc.setFillColor(...sc);
  doc.roundedRect(ml, y, cw, 8, 2, 2, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
  doc.text(`STATUS: ${t.status.toUpperCase()}${t.remarks ? "  |  " + t.remarks : ""}`, W / 2, y + 5.5, { align: "center" });
  y += 13;

  // ── Signature block ──
  if (y + 28 < H - 10) {
    doc.setTextColor(40, 40, 40); doc.setFontSize(8); doc.setFont("helvetica", "normal");
    const sigW = (cw - 15) / 4;
    ["Applicant", "Head of Dept", "HR Verified By", "Approved By (GM)"].forEach((lbl, i) => {
      const sx = ml + i * (sigW + 5);
      doc.setDrawColor(120); doc.setLineWidth(0.3);
      doc.line(sx, y + 12, sx + sigW, y + 12);
      doc.text(lbl, sx + sigW / 2, y + 16, { align: "center" });
      doc.text("Name: __________", sx, y + 21);
      doc.text("Date:  __________", sx, y + 26);
    });
  }

  // ── Footer ──
  doc.setFontSize(7); doc.setTextColor(150);
  doc.text("Ital Auto HRMS  |  Travel Warrant  |  Confidential – For Internal Use Only", W / 2, H - 5, { align: "center" });

  doc.output("dataurlnewwindow");
  showToast("Travel Warrant PDF opened in new tab.", "success");
}

function exportReportToPDF() {
  const leavesToExport = state.filteredReportLeaves || [];
  if (leavesToExport.length === 0) {
    showToast("No data to export", "warning");
    return;
  }
  
  // jsPDF UMD exposes window.jspdf.jsPDF
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    showToast("PDF library not loaded. Please check your internet connection.", "error");
    return;
  }
  
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  
  // ---- Header ----
  doc.setFillColor(196, 18, 48); // Ferrari red
  doc.rect(0, 0, 297, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ital Auto HRMS – Leave Report", 14, 10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(_getReportSubtitle(), 14, 17);
  
  // ---- KPI summary row ----
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  const kpiDays = document.getElementById("report-kpi-days")?.textContent || "0";
  const kpiApproved = document.getElementById("report-kpi-approved")?.textContent || "0";
  const kpiPending = document.getElementById("report-kpi-pending")?.textContent || "0";
  const kpiTop = document.getElementById("report-kpi-top-type")?.textContent || "-";
  doc.setFont("helvetica", "bold");
  doc.text(`Total Days Taken: ${kpiDays}   |   Approved: ${kpiApproved}   |   Pending: ${kpiPending}   |   Top Type: ${kpiTop}`, 14, 29);
  
  // ---- Table ----
  const head = [["Ref ID", "Emp No", "Employee Name", "Leave Type", "Start Date", "End Date", "Days", "Status", "Reference No", "Reason"]];
  const body = leavesToExport.map(l => [
    l.id,
    l.staffId,
    l.staffName || "",
    (l.leaveType || "").toUpperCase(),
    formatTableDate(l.startDate),
    formatTableDate(l.endDate),
    l.totalDays,
    l.status,
    l.referenceNo || "-",
    l.reason || "-"
  ]);
  
  doc.autoTable({
    startY: 34,
    head: head,
    body: body,
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [196, 18, 48], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [252, 245, 245] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 18 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 12 },
      7: { cellWidth: 20 },
      8: { cellWidth: 25 },
      9: { cellWidth: "auto" }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(
        `Generated: ${new Date().toLocaleString()}   |   Page ${data.pageNumber} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 5
      );
    }
  });
  
  doc.save(`${_getReportFilename()}.pdf`);
  showToast("PDF report exported successfully!", "success");
}

function exportReportToXLS() {
  const leavesToExport = state.filteredReportLeaves || [];
  if (leavesToExport.length === 0) {
    showToast("No data to export", "warning");
    return;
  }
  if (!window.XLSX) {
    showToast("Excel library not loaded. Please check your internet connection.", "error");
    return;
  }
  
  const filename = _getReportFilename();
  const subtitle = _getReportSubtitle();
  const generatedAt = new Date().toLocaleString();
  
  // Build worksheet data
  const wsData = [];
  // Title rows
  wsData.push(["Ital Auto HRMS – Leave Report"]);
  wsData.push([subtitle]);
  wsData.push([`Generated: ${generatedAt}`]);
  wsData.push([]);  // blank spacer
  
  // KPI summary
  const kpiDays = document.getElementById("report-kpi-days")?.textContent || "0";
  const kpiApproved = document.getElementById("report-kpi-approved")?.textContent || "0";
  const kpiPending = document.getElementById("report-kpi-pending")?.textContent || "0";
  const kpiTop = document.getElementById("report-kpi-top-type")?.textContent || "-";
  wsData.push(["Total Days Taken", kpiDays, "Approved Leaves", kpiApproved, "Pending Leaves", kpiPending, "Top Leave Type", kpiTop]);
  wsData.push([]);  // blank spacer
  
  // Table header
  wsData.push(["Ref ID", "Emp No", "Employee Name", "Leave Type", "Start Date", "End Date", "Total Days", "Status", "Reference No", "Reason"]);
  
  // Data rows
  leavesToExport.forEach(l => {
    wsData.push([
      l.id,
      l.staffId,
      l.staffName || "",
      (l.leaveType || "").toUpperCase(),
      formatTableDate(l.startDate),
      formatTableDate(l.endDate),
      l.totalDays,
      l.status,
      l.referenceNo || "-",
      l.reason || "-"
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  ws["!cols"] = [
    { wch: 14 }, { wch: 12 }, { wch: 28 }, { wch: 24 },
    { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
    { wch: 18 }, { wch: 30 }
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leave Report");
  XLSX.writeFile(wb, `${filename}.xlsx`);
  showToast("Excel report exported successfully!", "success");
}

function printLeaveReport() {
  const reportType = document.getElementById("report-filter-type").value;
  const year = document.getElementById("report-filter-year").value;
  let subtitleText = "";
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    subtitleText = `Monthly Report - ${monthName} ${year}`;
  } else {
    subtitleText = `Yearly Report - ${year}`;
  }
  
  const dept = document.getElementById("report-filter-dept").value;
  const empSelect = document.getElementById("report-filter-employee");
  const empName = empSelect.options[empSelect.selectedIndex]?.text || "- ALL -";
  const leaveType = document.getElementById("report-filter-leave-type").value;
  
  let filtersText = [];
  if (dept !== "- ALL -") filtersText.push(`Department: ${dept}`);
  if (empSelect.value !== "- ALL -") filtersText.push(`Employee: ${empName}`);
  if (leaveType !== "- ALL -") filtersText.push(`Leave Type: ${leaveType}`);
  
  if (filtersText.length > 0) {
    subtitleText += ` (${filtersText.join(" | ")})`;
  }
  
  document.getElementById("report-print-subtitle").textContent = subtitleText;
  window.print();
}

// ========================================================
// TRAVEL PORTAL - REPORT MODULE
// ========================================================

function initTravelReportPage() {
  if (!state.travelReportInitialized) {
    const typeSelect = document.getElementById("travel-report-filter-type");
    const monthRow = document.getElementById("travel-report-month-row");
    const monthSelect = document.getElementById("travel-report-filter-month");
    const yearSelect = document.getElementById("travel-report-filter-year");
    const deptSelect = document.getElementById("travel-report-filter-dept");
    const empSelect = document.getElementById("travel-report-filter-employee");
    const purposeSelect = document.getElementById("travel-report-filter-purpose");
    const exportCsvBtn = document.getElementById("travel-export-report-csv-btn");
    const printBtn = document.getElementById("travel-print-report-btn");
    const exportPdfBtn = document.getElementById("travel-export-report-pdf-btn");
    const exportXlsBtn = document.getElementById("travel-export-report-xls-btn");
    
    typeSelect.addEventListener("change", () => {
      if (typeSelect.value === "yearly") {
        monthRow.classList.add("hidden");
      } else {
        monthRow.classList.remove("hidden");
      }
      generateTravelReport();
    });
    
    monthSelect.addEventListener("change", generateTravelReport);
    yearSelect.addEventListener("change", generateTravelReport);
    deptSelect.addEventListener("change", () => {
      populateTravelReportEmployees();
      generateTravelReport();
    });
    empSelect.addEventListener("change", generateTravelReport);
    purposeSelect.addEventListener("change", generateTravelReport);
    
    if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportTravelReportToCSV);
    if (printBtn) printBtn.addEventListener("click", printTravelReport);
    if (exportPdfBtn) exportPdfBtn.addEventListener("click", exportTravelReportToPDF);
    if (exportXlsBtn) exportXlsBtn.addEventListener("click", exportTravelReportToXLS);
    
    // Set initial default values
    const today = new Date();
    monthSelect.value = today.getMonth();
    
    const currentYear = today.getFullYear().toString();
    if (Array.from(yearSelect.options).some(opt => opt.value === currentYear)) {
      yearSelect.value = currentYear;
    } else {
      yearSelect.value = "2026";
    }
    
    deptSelect.value = "- ALL -";
    purposeSelect.value = "- ALL -";
    
    state.travelReportInitialized = true;
  }
  
  populateTravelReportEmployees();
  generateTravelReport();
}

function populateTravelReportEmployees() {
  const deptSelect = document.getElementById("travel-report-filter-dept");
  const empSelect = document.getElementById("travel-report-filter-employee");
  if (!deptSelect || !empSelect) return;
  const selectedDept = deptSelect.value;
  
  const currentSelection = empSelect.value;
  empSelect.innerHTML = `<option value="- ALL -">- ALL -</option>`;
  
  const filteredUsers = Object.values(state.users).filter(user => {
    if (selectedDept === "- ALL -") return true;
    return user.department === selectedDept;
  });
  
  filteredUsers.forEach(user => {
    const opt = document.createElement("option");
    opt.value = user.id;
    opt.textContent = `${user.name} [${user.id}]`;
    empSelect.appendChild(opt);
  });

  if (Array.from(empSelect.options).some(opt => opt.value === currentSelection)) {
    empSelect.value = currentSelection;
  } else {
    empSelect.value = "- ALL -";
  }
}

function generateTravelReport() {
  const reportType = document.getElementById("travel-report-filter-type").value;
  const monthSelect = document.getElementById("travel-report-filter-month");
  const monthVal = parseInt(monthSelect.value, 10);
  const yearVal = document.getElementById("travel-report-filter-year").value;
  const deptFilter = document.getElementById("travel-report-filter-dept").value;
  const empFilter = document.getElementById("travel-report-filter-employee").value;
  const purposeFilter = document.getElementById("travel-report-filter-purpose").value;
  
  let filtered = state.travels || [];
  
  // Apply date filter
  filtered = filtered.filter(t => {
    if (!t.startDate) return false;
    const parts = t.startDate.split("-");
    if (parts.length !== 3) return false;
    
    const yearMatches = parts[0] === yearVal;
    if (!yearMatches) return false;
    
    if (reportType === "monthly") {
      const monthMatches = (parseInt(parts[1], 10) - 1) === monthVal;
      return monthMatches;
    }
    return true;
  });
  
  // Apply department filter
  if (deptFilter !== "- ALL -") {
    filtered = filtered.filter(t => {
      const u = state.users[t.staffId];
      return u && u.department === deptFilter;
    });
  }
  
  // Apply employee filter
  if (empFilter !== "- ALL -") {
    filtered = filtered.filter(t => t.staffId === empFilter);
  }
  
  // Apply purpose filter
  if (purposeFilter !== "- ALL -") {
    filtered = filtered.filter(t => t.purpose === purposeFilter);
  }
  
  state.filteredReportTravels = filtered;
  
  const approvedTravels = filtered.filter(t => t.status === "Approved");
  const totalCost = approvedTravels.reduce((sum, t) => sum + parseFloat(t.costTotal || t.budget || 0), 0);
  const totalDays = approvedTravels.reduce((sum, t) => sum + calculateDays(t.startDate, t.endDate), 0);
  const approvedCount = approvedTravels.length;
  const pendingCount = filtered.filter(t => t.status === "Pending").length;
  
  document.getElementById("travel-report-kpi-cost").textContent = `RM ${totalCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
  document.getElementById("travel-report-kpi-days").textContent = `${totalDays} Day${totalDays !== 1 ? 's' : ''}`;
  document.getElementById("travel-report-kpi-approved").textContent = approvedCount;
  document.getElementById("travel-report-kpi-pending").textContent = pendingCount;
  
  // Compute purpose cost distribution
  const costByPurpose = {};
  
  const purposeSelect = document.getElementById("travel-report-filter-purpose");
  const standardPurposes = Array.from(purposeSelect.options)
    .map(opt => opt.value)
    .filter(val => val !== "- ALL -");
    
  standardPurposes.forEach(p => costByPurpose[p] = 0);
  
  approvedTravels.forEach(t => {
    const p = t.purpose;
    if (costByPurpose[p] !== undefined) {
      costByPurpose[p] += parseFloat(t.costTotal || t.budget || 0);
    } else {
      costByPurpose[p] = parseFloat(t.costTotal || t.budget || 0);
    }
  });
  
  const maxCost = Math.max(...Object.values(costByPurpose), 0);
  const activePurposes = Object.entries(costByPurpose)
    .filter(([purpose, cost]) => cost > 0)
    .sort((a, b) => b[1] - a[1]);
    
  const barsContainer = document.getElementById("travel-report-distribution-bars");
  if (activePurposes.length === 0) {
    barsContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 1.5rem 0;">No approved travel warrant cost data for this period.</div>`;
  } else {
    let barsHTML = "";
    activePurposes.forEach(([purpose, cost]) => {
      const percent = maxCost > 0 ? (cost / maxCost) * 100 : 0;
      barsHTML += `
        <div class="distribution-bar-row">
          <div class="distribution-bar-label" style="width: 250px;" title="${purpose}">${purpose}</div>
          <div class="distribution-bar-track">
            <div class="distribution-bar-fill" style="width: ${percent}%"></div>
          </div>
          <div class="distribution-bar-val" style="width: 80px;">RM ${cost.toLocaleString()}</div>
        </div>
      `;
    });
    barsContainer.innerHTML = barsHTML;
  }
  
  // Render grid table details
  const detailsTbody = document.getElementById("travel-report-details-tbody");
  if (filtered.length === 0) {
    detailsTbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No travel warrant applications found matching the selected filters.</td></tr>`;
  } else {
    let detailsHTML = "";
    filtered.forEach(t => {
      const statusClass = t.status.toLowerCase();
      const statusBadge = `<span class="badge ${statusClass}">${t.status}</span>`;
      detailsHTML += `
        <tr>
          <td>${t.id}</td>
          <td>${t.staffId}</td>
          <td style="font-weight: 600;">${t.staffName}</td>
          <td>${t.destination}</td>
          <td>${formatTableDate(t.startDate)}</td>
          <td>${formatTableDate(t.endDate)}</td>
          <td>${t.purpose}</td>
          <td>${t.transport || "-"}</td>
          <td style="font-weight: 600;">RM ${(t.costTotal || t.budget || 0).toLocaleString()}</td>
          <td>${statusBadge}</td>
          <td>${t.remarks || t.notes || "-"}</td>
        </tr>
      `;
    });
    detailsTbody.innerHTML = detailsHTML;
  }
  
  document.getElementById("travel-report-results-container").classList.remove("hidden");
}

function _getTravelReportFilename() {
  const reportType = document.getElementById("travel-report-filter-type").value;
  const year = document.getElementById("travel-report-filter-year").value;
  let filename = `Travel_Report_${year}`;
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("travel-report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    filename += `_${monthName}`;
  }
  return filename;
}

function _getTravelReportSubtitle() {
  const reportType = document.getElementById("travel-report-filter-type").value;
  const year = document.getElementById("travel-report-filter-year").value;
  let subtitleText = "";
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("travel-report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    subtitleText = `Monthly Report - ${monthName} ${year}`;
  } else {
    subtitleText = `Yearly Report - ${year}`;
  }
  return subtitleText;
}

function exportTravelReportToCSV() {
  const travelsToExport = state.filteredReportTravels || [];
  if (travelsToExport.length === 0) {
    showToast("No data to export", "warning");
    return;
  }
  
  let csvRows = [];
  csvRows.push("Ref ID,Emp ID,Employee Name,Destination,Start Date,End Date,Purpose,Mode of Travel,Est. Cost (RM),Status,Remarks");
  
  travelsToExport.forEach(t => {
    const row = [
      t.id,
      t.staffId,
      `"${(t.staffName || "").replace(/"/g, '""')}"`,
      `"${(t.destination || "").replace(/"/g, '""')}"`,
      formatTableDate(t.startDate),
      formatTableDate(t.endDate),
      `"${(t.purpose || "").replace(/"/g, '""')}"`,
      `"${(t.transport || "").replace(/"/g, '""')}"`,
      t.costTotal || t.budget || 0,
      t.status,
      `"${(t.remarks || t.notes || "").replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(","));
  });
  
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${_getTravelReportFilename()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showToast("CSV report exported successfully!", "success");
}

function exportTravelReportToPDF() {
  const travelsToExport = state.filteredReportTravels || [];
  if (travelsToExport.length === 0) {
    showToast("No data to export", "warning");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    showToast("PDF library not loaded. Please check your internet connection.", "error");
    return;
  }
  
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  
  // ---- Header ----
  doc.setFillColor(196, 18, 48); // Ferrari red
  doc.rect(0, 0, 297, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ital Auto HRMS – Travel Report", 14, 10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(_getTravelReportSubtitle(), 14, 17);
  
  // ---- KPI summary row ----
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  const kpiCost = document.getElementById("travel-report-kpi-cost")?.textContent || "RM 0";
  const kpiDays = document.getElementById("travel-report-kpi-days")?.textContent || "0";
  const kpiApproved = document.getElementById("travel-report-kpi-approved")?.textContent || "0";
  const kpiPending = document.getElementById("travel-report-kpi-pending")?.textContent || "0";
  doc.setFont("helvetica", "bold");
  doc.text(`Total Cost: ${kpiCost}   |   Total Travel Days: ${kpiDays}   |   Approved: ${kpiApproved}   |   Pending: ${kpiPending}`, 14, 29);
  
  // ---- Table ----
  const head = [["Ref ID", "Emp No", "Employee Name", "Destination", "Start Date", "End Date", "Purpose", "Transport", "Cost (RM)", "Status"]];
  const body = travelsToExport.map(t => [
    t.id,
    t.staffId,
    t.staffName || "",
    t.destination || "",
    formatTableDate(t.startDate),
    formatTableDate(t.endDate),
    t.purpose || "",
    t.transport || "",
    t.costTotal || t.budget || 0,
    t.status
  ]);
  
  doc.autoTable({
    startY: 34,
    head: head,
    body: body,
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [196, 18, 48], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [252, 245, 245] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 15 },
      2: { cellWidth: 32 },
      3: { cellWidth: 40 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 40 },
      7: { cellWidth: 25 },
      8: { cellWidth: 18 },
      9: { cellWidth: "auto" }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(
        `Generated: ${new Date().toLocaleString()}   |   Page ${data.pageNumber} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 5
      );
    }
  });
  
  doc.save(`${_getTravelReportFilename()}.pdf`);
  showToast("PDF report exported successfully!", "success");
}

function exportTravelReportToXLS() {
  const travelsToExport = state.filteredReportTravels || [];
  if (travelsToExport.length === 0) {
    showToast("No data to export", "warning");
    return;
  }
  if (!window.XLSX) {
    showToast("Excel library not loaded. Please check your internet connection.", "error");
    return;
  }
  
  const filename = _getTravelReportFilename();
  const subtitle = _getTravelReportSubtitle();
  const generatedAt = new Date().toLocaleString();
  
  // Build worksheet data
  const wsData = [];
  wsData.push(["Ital Auto HRMS – Travel Report"]);
  wsData.push([subtitle]);
  wsData.push([`Generated: ${generatedAt}`]);
  wsData.push([]);  // blank spacer
  
  // KPI summary in excel
  const kpiCost = document.getElementById("travel-report-kpi-cost")?.textContent || "RM 0";
  const kpiDays = document.getElementById("travel-report-kpi-days")?.textContent || "0";
  const kpiApproved = document.getElementById("travel-report-kpi-approved")?.textContent || "0";
  const kpiPending = document.getElementById("travel-report-kpi-pending")?.textContent || "0";
  wsData.push([`Total Cost: ${kpiCost}`, `Total Travel Days: ${kpiDays}`, `Approved Warrants: ${kpiApproved}`, `Pending Warrants: ${kpiPending}`]);
  wsData.push([]);  // blank spacer
  
  // Table headers
  wsData.push(["Ref ID", "Emp No", "Employee Name", "Destination", "Start Date", "End Date", "Purpose", "Transport", "Est. Cost (RM)", "Status", "Reason / Remark"]);
  
  travelsToExport.forEach(t => {
    wsData.push([
      t.id,
      t.staffId,
      t.staffName || "",
      t.destination || "",
      formatTableDate(t.startDate),
      formatTableDate(t.endDate),
      t.purpose || "",
      t.transport || "",
      t.costTotal || t.budget || 0,
      t.status,
      t.remarks || t.notes || ""
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  ws["!cols"] = [
    { wch: 14 }, { wch: 12 }, { wch: 28 }, { wch: 28 },
    { wch: 14 }, { wch: 14 }, { wch: 28 }, { wch: 18 },
    { wch: 14 }, { wch: 14 }, { wch: 30 }
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Travel Report");
  XLSX.writeFile(wb, `${filename}.xlsx`);
  showToast("Excel report exported successfully!", "success");
}

function printTravelReport() {
  const reportType = document.getElementById("travel-report-filter-type").value;
  const year = document.getElementById("travel-report-filter-year").value;
  let subtitleText = "";
  if (reportType === "monthly") {
    const monthSelect = document.getElementById("travel-report-filter-month");
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    subtitleText = `Monthly Report - ${monthName} ${year}`;
  } else {
    subtitleText = `Yearly Report - ${year}`;
  }
  
  const dept = document.getElementById("travel-report-filter-dept").value;
  const empSelect = document.getElementById("travel-report-filter-employee");
  const empName = empSelect.options[empSelect.selectedIndex]?.text || "- ALL -";
  const purpose = document.getElementById("travel-report-filter-purpose").value;
  
  let filtersText = [];
  if (dept !== "- ALL -") filtersText.push(`Department: ${dept}`);
  if (empSelect.value !== "- ALL -") filtersText.push(`Employee: ${empName}`);
  if (purpose !== "- ALL -") filtersText.push(`Purpose: ${purpose}`);
  
  if (filtersText.length > 0) {
    subtitleText += ` (${filtersText.join(" | ")})`;
  }
  
  document.getElementById("travel-report-print-subtitle").textContent = subtitleText;
  window.print();
}

// ========================================================
// E-LEAVE SYSTEM - STAFF
// ========================================================

function renderLeaveStaffDashboard() {
  const balancesRow = document.getElementById("leave-staff-balance-row");
  const requestsTbody = document.getElementById("leave-staff-recent-tbody");
  
  const user = state.users[state.currentUser.id];
  const balances = user.leaveBalances || { "ANNUAL LEAVE": 24, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 };

  // Generate Circle balances row
  const categories = [
    { name: "Annual Leave", key: "ANNUAL LEAVE", max: DEFAULT_USERS[state.currentUser.id]?.leaveBalances["ANNUAL LEAVE"] || 24, class: "annual" },
    { name: "Sick Leave", key: "SICK LEAVE", max: DEFAULT_USERS[state.currentUser.id]?.leaveBalances["SICK LEAVE"] || 14, class: "sick" },
    { name: "Emergency Leave", key: "EMERGENCY LEAVE", max: DEFAULT_USERS[state.currentUser.id]?.leaveBalances["EMERGENCY LEAVE"] || 5, class: "emergency" }
  ];

  balancesRow.innerHTML = "";
  categories.forEach(cat => {
    const left = balances[cat.key] !== undefined ? balances[cat.key] : (balances[cat.name] || 0);
    const percent = cat.max > 0 ? (left / cat.max) * 100 : 0;
    
    // Circle dash Math: r=30, circ=188.4
    const radius = 30;
    const circ = 2 * Math.PI * radius; // 188.49
    const offset = circ - (percent / 100) * circ;
    
    let ringColor = "var(--ferrari-red)";
    if (cat.class === "sick") ringColor = "var(--ferrari-yellow)";
    if (cat.class === "emergency") ringColor = "var(--warning)";

    balancesRow.innerHTML += `
      <div class="balance-card ${cat.class}">
        <div class="balance-card-info">
          <h4>${cat.name}</h4>
          <p>Available allowance</p>
          <div>
            <span class="days-count">${left}</span>
            <span class="days-total">/ ${cat.max} Days Left</span>
          </div>
        </div>
        <div class="progress-ring-container">
          <svg class="progress-ring" width="80" height="80">
            <circle class="progress-ring__circle" stroke="#f1f5f9" stroke-width="6" fill="transparent" r="${radius}" cx="40" cy="40" />
            <circle class="progress-ring__circle" stroke="${ringColor}" stroke-width="6" fill="transparent" r="${radius}" cx="40" cy="40" 
                    stroke-dasharray="${circ}" stroke-dashoffset="${offset}" />
          </svg>
          <div class="progress-ring-text">${Math.round(percent)}%</div>
        </div>
      </div>
    `;
  });

  // Personal recent requests
  const myLeaves = state.leaves.filter(l => l.staffId === state.currentUser.id);
  requestsTbody.innerHTML = "";
  const displayLeaves = [...myLeaves].reverse().slice(0, 5);

  if (displayLeaves.length === 0) {
    requestsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No leaves submitted.</td></tr>`;
  } else {
    displayLeaves.forEach(l => {
      const statusClass = l.status.toLowerCase();
      requestsTbody.innerHTML += `
        <tr>
          <td>${l.id}</td>
          <td style="font-weight: 600;">${l.leaveType}</td>
          <td>${formatHumanDate(l.startDate)} - ${formatHumanDate(l.endDate)}</td>
          <td>${l.totalDays} Days</td>
          <td><span class="badge ${statusClass}">${l.status}</span></td>
        </tr>
      `;
    });
  }

  // Render staff personal leave calendar
  renderStaffCalendar();
}

function renderStaffCalendar() {
  const container = document.getElementById("calendar-staff-days-grid");
  const monthYearEl = document.getElementById("calendar-staff-month-year");
  
  const m = state.activeCalendarMonth;
  const y = state.activeCalendarYear;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthYearEl.textContent = `${monthNames[m]} ${y}`;

  container.innerHTML = "";

  const firstDayIndex = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    container.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    
    if (y === 2026 && m === 5 && day === 8) {
      dayCell.classList.add("today");
    }

    dayCell.innerHTML = `<span class="calendar-day-number">${day}</span>`;
    
    // Filter leaves for this day for CURRENT staff user
    const dayDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const myDayLeaves = state.leaves.filter(l => {
      return l.staffId === state.currentUser.id && dayDateStr >= l.startDate && dayDateStr <= l.endDate;
    });

    if (myDayLeaves.length > 0) {
      const eventsContainer = document.createElement("div");
      eventsContainer.className = "calendar-day-events";
      
      myDayLeaves.forEach(l => {
        let typeClass = "annual";
        if (l.leaveType === "Sick Leave") typeClass = "sick";
        if (l.leaveType === "Emergency Leave") typeClass = "emergency";

        const dot = document.createElement("div");
        dot.className = `calendar-event-dot ${typeClass}`;
        dot.textContent = l.status;
        dot.title = `${l.leaveType}: ${l.status}`;
        eventsContainer.appendChild(dot);
      });
      dayCell.appendChild(eventsContainer);
    }

    container.appendChild(dayCell);
  }
}

function renderLeaveStaffMy() {
  const tbody = document.getElementById("leave-staff-my-tbody");
  tbody.innerHTML = "";

  const myLeaves = state.leaves.filter(l => l.staffId === state.currentUser.id);

  if (myLeaves.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No leave requests recorded. Use 'Apply Leave' to submit.</td></tr>`;
  } else {
    myLeaves.forEach(l => {
      const statusClass = l.status.toLowerCase();
      tbody.innerHTML += `
        <tr>
          <td>${l.id}</td>
          <td style="font-weight: 600;">${l.leaveType}</td>
          <td>${formatHumanDate(l.startDate)} - ${formatHumanDate(l.endDate)} (${l.totalDays} Days)</td>
          <td>${l.reliefStaff}</td>
          <td><span class="badge ${statusClass}">${l.status}</span></td>
          <td style="color: var(--text-secondary); font-style: italic;">${l.remarks || "-"}</td>
        </tr>
      `;
    });
  }
}

// ==========================================
// FORM SUBMISSIONS LOGIC
// ==========================================

// Travel Form Submit (HR)
safeAddListener("travel-hr-apply-form", "submit", function(e) {
  e.preventDefault();
  
  const dest = document.getElementById("travel-hr-destination").value;
  const purpose = document.getElementById("travel-hr-purpose").value;
  const start = document.getElementById("travel-hr-start-date").value;
  const end = document.getElementById("travel-hr-end-date").value;
  
  // Selected modes
  const modes = [];
  document.querySelectorAll('input[name="travel-hr-mode"]:checked').forEach(cb => {
    modes.push(cb.value);
  });

  const transport = modes.join(", ") || "Other";

  if (new Date(start) > new Date(end)) {
    showToast("Departure date cannot be after return date.", "error");
    return;
  }

  // Validate ECARF for advance amount
  const advanceAmount = parseFloat(document.getElementById("travel-hr-advance").value) || 0;
  let ecarfFilename = "";
  if (advanceAmount > 0) {
    const fileInput = document.getElementById("travel-hr-ecarf-file");
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      ecarfFilename = fileInput.files[0].name;
    } else {
      showToast("Approved ECARF document is required for cash advances.", "error");
      return;
    }
  }

  const costTotal = parseFloat(document.getElementById("travel-hr-cost-total").value) || 0;

  const newRequest = {
    id: `TW-${1000 + state.travels.length + 1}`,
    staffId: state.currentUser.id,
    staffName: state.currentUser.name,
    role: state.currentUser.role,
    destination: dest,
    purpose: purpose,
    startDate: start,
    endDate: end,
    transport: transport,
    budget: costTotal,
    notes: "",
    status: "Pending", // Requires approval by another administrator
    remarks: "",
    dateApplied: new Date().toISOString().split('T')[0],

    // New fields
    jobGrade: document.getElementById("travel-hr-grade").value,
    divDept: document.getElementById("travel-hr-dept").value,
    branch: document.getElementById("travel-hr-branch").value,
    deptTime: document.getElementById("travel-hr-dept-time").value,
    deptDist: parseFloat(document.getElementById("travel-hr-dept-dist").value) || 0,
    arrTime: document.getElementById("travel-hr-arr-time").value,
    arrDist: parseFloat(document.getElementById("travel-hr-arr-dist").value) || 0,
    modes: modes,
    lodgingRate: parseFloat(document.getElementById("travel-hr-lodging-rate").value) || 0,
    lodgingDays: parseFloat(document.getElementById("travel-hr-lodging-days").value) || 0,
    lodgingTotal: parseFloat(document.getElementById("travel-hr-lodging-total").value) || 0,
    mileageKm: parseFloat(document.getElementById("travel-hr-mileage-km").value) || 0,
    mileage: parseFloat(document.getElementById("travel-hr-mileage").value) || 0,
    fuel: parseFloat(document.getElementById("travel-hr-fuel").value) || 0,
    toll: parseFloat(document.getElementById("travel-hr-toll").value) || 0,
    airfares: parseFloat(document.getElementById("travel-hr-airfares").value) || 0,
    subsistenceRate: parseFloat(document.getElementById("travel-hr-subsistence-rate").value) || 0,
    subsistenceDays: parseFloat(document.getElementById("travel-hr-subsistence-days").value) || 0,
    subsistenceTotal: parseFloat(document.getElementById("travel-hr-subsistence-total").value) || 0,
    entDetail: document.getElementById("travel-hr-ent-detail").value,
    entTotal: parseFloat(document.getElementById("travel-hr-ent-total").value) || 0,
    costTotal: costTotal,
    advanceAmount: advanceAmount,
    ecarfFilename: ecarfFilename
  };

  state.travels.push(newRequest);
  saveDatabase();
  
  this.reset();
  showToast("Travel warrant application submitted successfully!");
  triggerConfetti();
  
  state.activeSection = "sec-travel-hr-my";
  navigateUI();
});

// Travel Form Submit (Staff)
safeAddListener("travel-staff-apply-form", "submit", function(e) {
  e.preventDefault();
  
  const dest = document.getElementById("travel-staff-destination").value;
  const purpose = document.getElementById("travel-staff-purpose").value;
  const start = document.getElementById("travel-staff-start-date").value;
  const end = document.getElementById("travel-staff-end-date").value;
  
  // Selected modes
  const modes = [];
  document.querySelectorAll('input[name="travel-staff-mode"]:checked').forEach(cb => {
    modes.push(cb.value);
  });

  const transport = modes.join(", ") || "Other";

  if (new Date(start) > new Date(end)) {
    showToast("Departure date cannot be after return date.", "error");
    return;
  }

  // Validate ECARF for advance amount
  const advanceAmount = parseFloat(document.getElementById("travel-staff-advance").value) || 0;
  let ecarfFilename = "";
  if (advanceAmount > 0) {
    const fileInput = document.getElementById("travel-staff-ecarf-file");
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      ecarfFilename = fileInput.files[0].name;
    } else {
      showToast("Approved ECARF document is required for cash advances.", "error");
      return;
    }
  }

  const costTotal = parseFloat(document.getElementById("travel-staff-cost-total").value) || 0;

  const initialStatus = (state.currentUser.id === "IM018" || state.currentUser.isAdmin) ? "Approved" : "Pending Recommendation";

  const newRequest = {
    id: `TW-${1000 + state.travels.length + 1}`,
    staffId: state.currentUser.id,
    staffName: state.currentUser.name,
    role: state.currentUser.role,
    destination: dest,
    purpose: purpose,
    startDate: start,
    endDate: end,
    transport: transport,
    budget: costTotal,
    notes: "",
    status: initialStatus,
    remarks: initialStatus === "Approved" ? "Auto Approved by System" : "",
    dateApplied: new Date().toISOString().split('T')[0],

    // New fields
    jobGrade: document.getElementById("travel-staff-grade").value,
    divDept: document.getElementById("travel-staff-dept").value,
    branch: document.getElementById("travel-staff-branch").value,
    deptTime: document.getElementById("travel-staff-dept-time").value,
    deptDist: parseFloat(document.getElementById("travel-staff-dept-dist").value) || 0,
    arrTime: document.getElementById("travel-staff-arr-time").value,
    arrDist: parseFloat(document.getElementById("travel-staff-arr-dist").value) || 0,
    modes: modes,
    lodgingRate: parseFloat(document.getElementById("travel-staff-lodging-rate").value) || 0,
    lodgingDays: parseFloat(document.getElementById("travel-staff-lodging-days").value) || 0,
    lodgingTotal: parseFloat(document.getElementById("travel-staff-lodging-total").value) || 0,
    mileageKm: parseFloat(document.getElementById("travel-staff-mileage-km").value) || 0,
    mileage: parseFloat(document.getElementById("travel-staff-mileage").value) || 0,
    fuel: parseFloat(document.getElementById("travel-staff-fuel").value) || 0,
    toll: parseFloat(document.getElementById("travel-staff-toll").value) || 0,
    airfares: parseFloat(document.getElementById("travel-staff-airfares").value) || 0,
    subsistenceRate: parseFloat(document.getElementById("travel-staff-subsistence-rate").value) || 0,
    subsistenceDays: parseFloat(document.getElementById("travel-staff-subsistence-days").value) || 0,
    subsistenceTotal: parseFloat(document.getElementById("travel-staff-subsistence-total").value) || 0,
    entDetail: document.getElementById("travel-staff-ent-detail").value,
    entTotal: parseFloat(document.getElementById("travel-staff-ent-total").value) || 0,
    costTotal: costTotal,
    advanceAmount: advanceAmount,
    ecarfFilename: ecarfFilename
  };

  if (initialStatus === "Pending Recommendation") {
    // Send email to HOD (Carter Logan)
    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    const bodyText = `Dear Recommender,

${newRequest.staffName} has requested Travel Warrant recommendation.

Day of Travel : ${days} days
From : ${formatHumanDate(newRequest.startDate)}
To : ${formatHumanDate(newRequest.endDate)}
Travel purpose : ${newRequest.purpose}

Please click the link to go to e-Travel Warrant system : http://localhost:3000/login.html

Regards:
[e-TravelWarrant]

Do not reply to this email. This is an auto notification from e-TravelWarrant`;

    sendMockEmail("carter.logan@italauto.com.my", "Carter Logan", `Action Required: Travel Warrant Recommendation for ${newRequest.staffName}`, bodyText);
  }

  state.travels.push(newRequest);
  saveDatabase();
  
  this.reset();
  showToast("Travel warrant submitted! Opening your PDF...");
  triggerConfetti();
  setTimeout(() => generateTravelPDF(newRequest.id), 800);
  
  state.activeSection = "sec-travel-staff-my";
  navigateUI();
});

// Prefill and Calculation Helpers for Travel Warrant
function prefillTravelApplyForm(isAdmin) {
  const prefix = isAdmin ? "travel-hr" : "travel-staff";
  
  // Prefill details
  document.getElementById(`${prefix}-name`).value = state.currentUser.name;
  document.getElementById(`${prefix}-staff-id`).value = state.currentUser.id;
  document.getElementById(`${prefix}-position`).value = state.currentUser.role;
  
  // Set default grade based on role if select is empty
  const gradeEl = document.getElementById(`${prefix}-grade`);
  if (gradeEl && !gradeEl.value) {
    if (state.currentUser.role.includes("Director")) {
      gradeEl.value = "Director";
    } else if (state.currentUser.role.includes("Manager")) {
      gradeEl.value = "Manager";
    } else if (state.currentUser.role.includes("VP") || state.currentUser.role.includes("Head")) {
      gradeEl.value = "VP / Head of Department";
    } else {
      gradeEl.value = "Executive / Specialist";
    }
  }

  // Set default dates
  const todayStr = new Date().toISOString().split('T')[0];
  const startEl = document.getElementById(`${prefix}-start-date`);
  const endEl = document.getElementById(`${prefix}-end-date`);
  if (startEl && !startEl.value) startEl.value = todayStr;
  if (endEl && !endEl.value) endEl.value = todayStr;

  const deptTimeEl = document.getElementById(`${prefix}-dept-time`);
  const arrTimeEl = document.getElementById(`${prefix}-arr-time`);
  if (deptTimeEl && !deptTimeEl.value) deptTimeEl.value = todayStr + "T09:00";
  if (arrTimeEl && !arrTimeEl.value) arrTimeEl.value = todayStr + "T18:00";

  calculateFormTotals(isAdmin);
}

function calculateFormTotals(isAdmin) {
  const prefix = isAdmin ? "travel-hr" : "travel-staff";
  
  const lodgingRate = document.getElementById(`${prefix}-lodging-rate`);
  const lodgingDays = document.getElementById(`${prefix}-lodging-days`);
  const lodgingTotal = document.getElementById(`${prefix}-lodging-total`);

  const subsistenceRate = document.getElementById(`${prefix}-subsistence-rate`);
  const subsistenceDays = document.getElementById(`${prefix}-subsistence-days`);
  const subsistenceTotal = document.getElementById(`${prefix}-subsistence-total`);

  const mileageKm = document.getElementById(`${prefix}-mileage-km`);
  const mileageTotal = document.getElementById(`${prefix}-mileage`);

  const overallTotal = document.getElementById(`${prefix}-cost-total`);

  if (lodgingRate && lodgingDays && lodgingTotal) {
    lodgingTotal.value = (parseFloat(lodgingRate.value) || 0) * (parseFloat(lodgingDays.value) || 0);
  }
  if (subsistenceRate && subsistenceDays && subsistenceTotal) {
    subsistenceTotal.value = (parseFloat(subsistenceRate.value) || 0) * (parseFloat(subsistenceDays.value) || 0);
  }
  if (mileageKm && mileageTotal) {
    mileageTotal.value = (parseFloat(mileageKm.value) || 0) * 1.00;
  }

  const costInputs = [
    lodgingTotal,
    mileageTotal,
    document.getElementById(`${prefix}-fuel`),
    document.getElementById(`${prefix}-toll`),
    document.getElementById(`${prefix}-airfares`),
    subsistenceTotal,
    document.getElementById(`${prefix}-ent-total`)
  ];

  let sum = 0;
  costInputs.forEach(input => {
    if (input) sum += parseFloat(input.value) || 0;
  });
  if (overallTotal) overallTotal.value = sum;
}

function setupTravelCalculators() {
  const prefixes = ["travel-hr", "travel-staff"];
  
  prefixes.forEach(prefix => {
    const lodgingRate = document.getElementById(`${prefix}-lodging-rate`);
    const lodgingDays = document.getElementById(`${prefix}-lodging-days`);
    const subsistenceRate = document.getElementById(`${prefix}-subsistence-rate`);
    const subsistenceDays = document.getElementById(`${prefix}-subsistence-days`);
    const mileageKm = document.getElementById(`${prefix}-mileage-km`);
    const advanceInput = document.getElementById(`${prefix}-advance`);
    const ecarfContainer = document.getElementById(`${prefix}-ecarf-container`);
    const ecarfFile = document.getElementById(`${prefix}-ecarf-file`);

    const updateCalculations = () => {
      calculateFormTotals(prefix === "travel-hr");
    };

    const updateEcarfVisibility = () => {
      if (advanceInput && ecarfContainer && ecarfFile) {
        const val = parseFloat(advanceInput.value) || 0;
        if (val > 0) {
          ecarfContainer.style.display = "block";
          ecarfFile.required = true;
        } else {
          ecarfContainer.style.display = "none";
          ecarfFile.required = false;
        }
      }
    };

    if (lodgingRate) lodgingRate.addEventListener("input", updateCalculations);
    if (lodgingDays) lodgingDays.addEventListener("input", updateCalculations);
    if (subsistenceRate) subsistenceRate.addEventListener("input", updateCalculations);
    if (subsistenceDays) subsistenceDays.addEventListener("input", updateCalculations);
    if (mileageKm) mileageKm.addEventListener("input", updateCalculations);
    if (advanceInput) {
      advanceInput.addEventListener("input", updateEcarfVisibility);
      advanceInput.addEventListener("change", updateEcarfVisibility);
      // Run initial check
      updateEcarfVisibility();
    }

    const costInputs = [
      `${prefix}-fuel`,
      `${prefix}-toll`,
      `${prefix}-airfares`,
      `${prefix}-ent-total`
    ];

    costInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updateCalculations);
    });
  });
}

function viewTravelWarrant(id) {
  const t = state.travels.find(x => x.id === id);
  if (!t) {
    showToast("Travel request not found", "error");
    return;
  }

  const paper = document.getElementById("official-warrant-paper-content");

  // Determine checkbox ticks
  const modes = t.modes || [];
  const hasMode = (m) => modes.includes(m) ? '&#10004;' : ''; // Checkmark tick symbol

  const costTotal = t.costTotal || t.budget || 0;
  
  // Signature markers
  const requestedDate = t.dateApplied || '2026-06-08';
  
  let recommendedName = "";
  let recommendedDate = "";
  let approvedName = "";
  let approvedDate = "";
  let hrCheckedName = "";
  let hrCheckedDate = "";
  let hrVerifiedName = "";
  let hrVerifiedDate = "";
  let hrApprovedName = "";
  let hrApprovedDate = "";

  if (t.status === "Approved") {
    recommendedName = "Carter Logan";
    recommendedDate = t.dateApplied || "2026-06-08";
    approvedName = "Eleanor Vance";
    approvedDate = t.dateApplied || "2026-06-08";
    hrCheckedName = "HR Department";
    hrCheckedDate = t.dateApplied || "2026-06-08";
    hrVerifiedName = "Carter Logan";
    hrVerifiedDate = t.dateApplied || "2026-06-08";
    hrApprovedName = "Eleanor Vance";
    hrApprovedDate = t.dateApplied || "2026-06-08";
  }

  // Render official document
  paper.innerHTML = `
    <!-- Logo & Header -->
    <div class="official-warrant-header">
      <div class="official-warrant-brand">
        <!-- SVG Ferrari horse logo -->
        <img src="logo.png" class="official-warrant-logo-svg" alt="Ferrari Logo" style="object-fit: contain;">
        <div class="official-warrant-title-text">
          <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 15px; font-weight: 900; letter-spacing: 1px;">OFFICIAL FERRARI IMPORTER</h1>
          <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">ITAL AUTO MALAYSIA</h2>
        </div>
      </div>
      <div style="text-align: right;">
        <h2 style="font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 16px; margin: 0; color: #000000; letter-spacing: 0.5px;">TRAVEL WARRANT</h2>
        <span style="font-size: 9px; font-weight: bold; color: #333;">Ref No: ${t.id}</span>
      </div>
    </div>

    <!-- Employee Details -->
    <div class="official-warrant-section-title">Employee Details</div>
    <table class="official-warrant-table">
      <tr>
        <td style="width: 15%;"><strong>Name</strong></td>
        <td style="width: 35%;">${t.staffName}</td>
        <td style="width: 15%;"><strong>Employee No.</strong></td>
        <td style="width: 35%;">${t.staffId}</td>
      </tr>
      <tr>
        <td><strong>Position</strong></td>
        <td>${t.role || 'Employee'}</td>
        <td><strong>Job Grade</strong></td>
        <td>${t.jobGrade || 'Executive / Specialist'}</td>
      </tr>
      <tr>
        <td><strong>Div./Dept.</strong></td>
        <td>${t.divDept || 'HR and Admin Division'}</td>
        <td><strong>Branch</strong></td>
        <td>${t.branch || 'Ital Auto Malaysia'}</td>
      </tr>
    </table>

    <!-- Travelling Details -->
    <div class="official-warrant-section-title">Travelling Details</div>
    <table class="official-warrant-table">
      <tr>
        <td style="width: 40%;"><strong>1. Departure Date/Time</strong></td>
        <td style="width: 35%;">${t.deptTime ? formatHumanDateTime(t.deptTime) : formatHumanDate(t.startDate)}</td>
        <td style="width: 10%;"><strong>Distance:</strong></td>
        <td style="width: 15%;">${t.deptDist || 0} KM</td>
      </tr>
      <tr>
        <td><strong>2. Arrival At Home Base Time/Date</strong></td>
        <td>${t.arrTime ? formatHumanDateTime(t.arrTime) : formatHumanDate(t.endDate)}</td>
        <td><strong>Distance:</strong></td>
        <td>${t.arrDist || 0} KM</td>
      </tr>
      <tr>
        <td><strong>3. Destination</strong></td>
        <td colspan="3">${t.destination}</td>
      </tr>
      <tr>
        <td><strong>4. Travelling Period</strong></td>
        <td colspan="3">From <strong>${formatHumanDate(t.startDate)}</strong> to <strong>${formatHumanDate(t.endDate)}</strong></td>
      </tr>
      <tr>
        <td><strong>5. Purpose of Travelling</strong></td>
        <td colspan="3">${t.purpose}</td>
      </tr>
      <tr>
        <td><strong>6. Mode of Travelling</strong><br><small>(please tick &radic; where applicable)</small></td>
        <td colspan="3">
          <div class="official-warrant-checkbox-grid">
            <div class="official-warrant-checkbox-item">
              <span class="official-warrant-checkbox-box">${hasMode('Air')}</span>
              <span>Air</span>
            </div>
            <div class="official-warrant-checkbox-item">
              <span class="official-warrant-checkbox-box">${hasMode('Train')}</span>
              <span>Train</span>
            </div>
            <div class="official-warrant-checkbox-item">
              <span class="official-warrant-checkbox-box">${hasMode('Bus')}</span>
              <span>Bus</span>
            </div>
            <div class="official-warrant-checkbox-item">
              <span class="official-warrant-checkbox-box">${hasMode('Pool Car')}</span>
              <span>Pool Car</span>
            </div>
            <div class="official-warrant-checkbox-item">
              <span class="official-warrant-checkbox-box">${hasMode('Personal Car')}</span>
              <span>Personal Car</span>
            </div>
            <div class="official-warrant-checkbox-item">
              <span class="official-warrant-checkbox-box">${hasMode('Company Car')}</span>
              <span>Company Car</span>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Estimated Cost -->
    <div class="official-warrant-section-title">Estimated Cost</div>
    <table class="official-cost-table">
      <tr>
        <td class="cost-label-col">Lodging</td>
        <td class="cost-calc-col">Rate/day: RM ${t.lodgingRate || 0} X No. of Days: ${t.lodgingDays || 0}</td>
        <td class="cost-value-col">RM ${t.lodgingTotal || 0}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Mileage</td>
        <td class="cost-calc-col">Claims for travel by personal car (RM/KM)</td>
        <td class="cost-value-col">RM ${t.mileage || 0}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Fuel (if travel by co. car or rented car)</td>
        <td class="cost-calc-col">Fuel claims</td>
        <td class="cost-value-col">RM ${t.fuel || 0}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Toll</td>
        <td class="cost-calc-col">Toll fares / Highway claims</td>
        <td class="cost-value-col">RM ${t.toll || 0}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Airfares/Transportation fares</td>
        <td class="cost-calc-col">Flight / Transit tickets cost</td>
        <td class="cost-value-col">RM ${t.airfares || 0}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Subsistence Allowance <br><small>(20% Breakfast, 40% Lunch, 40% Dinner)</small></td>
        <td class="cost-calc-col">Rate/day: RM ${t.subsistenceRate || 0} X No. of Days: ${t.subsistenceDays || 0}</td>
        <td class="cost-value-col">RM ${t.subsistenceTotal || 0}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Entertainment (please provide details)</td>
        <td class="cost-calc-col">Detail: ${t.entDetail || '-'}</td>
        <td class="cost-value-col">RM ${t.entTotal || 0}</td>
      </tr>
      <tr style="background-color: #f8f9fc;">
        <td class="cost-label-col" style="font-size: 11px; font-weight: 800;">Total</td>
        <td class="cost-calc-col"></td>
        <td class="cost-value-col" style="font-size: 11px; font-weight: 900; border-bottom: 2px double #000;">RM ${costTotal}</td>
      </tr>
      <tr>
        <td class="cost-label-col">Advance Amount</td>
        <td class="cost-calc-col">
          <small>(if required kindly attach with ECARF)</small>
          ${t.ecarfFilename ? `<br><strong style="color: var(--ferrari-red); font-size: 0.8rem;"><i class="fa-solid fa-paperclip"></i> Attached: ${t.ecarfFilename}</strong>` : ''}
        </td>
        <td class="cost-value-col">RM ${t.advanceAmount || 0}</td>
      </tr>
    </table>

    <!-- Signatures -->
    <div class="official-warrant-signatures">
      <div class="official-signature-block">
        <span class="official-signature-title">REQUESTED BY:</span>
        <div class="official-signature-field">
          <div class="signature-stamp">${t.staffName}</div>
        </div>
        <div class="official-signature-details">
          <strong>Name:</strong> ${t.staffName}<br>
          <strong>Date:</strong> ${requestedDate}
        </div>
      </div>
      
      <div class="official-signature-block">
        <span class="official-signature-title">RECOMMENDED BY HOD:</span>
        <div class="official-signature-field">
          ${recommendedName ? `<div class="signature-stamp">${recommendedName}</div>` : ''}
        </div>
        <div class="official-signature-details">
          <strong>Name:</strong> ${recommendedName || '-'}<br>
          <strong>Date:</strong> ${recommendedDate || '-'}
        </div>
      </div>
      
      <div class="official-signature-block">
        <span class="official-signature-title">APPROVED BY:</span>
        <div class="official-signature-field">
          ${approvedName ? `<div class="signature-stamp">${approvedName}</div>` : ''}
        </div>
        <div class="official-signature-details">
          <strong>Name:</strong> ${approvedName || '-'}<br>
          <strong>Date:</strong> ${approvedDate || '-'}
        </div>
      </div>
    </div>

    <!-- HR Use Section -->
    <div class="official-hr-use-section">
      <div class="official-hr-use-header">For HR and Admin Division Use:</div>
      <div class="official-hr-use-grid">
        <div class="official-signature-block">
          <span class="official-signature-title">CHECKED BY:</span>
          <div class="official-signature-field">
            ${hrCheckedName ? `<div class="signature-stamp" style="font-size: 8px; border-color: #2ece89; color: #2ece89;">HR PASSED</div>` : ''}
          </div>
          <div class="official-signature-details">
            <strong>Name:</strong> ${hrCheckedName || '-'}<br>
            <strong>Date:</strong> ${hrCheckedDate || '-'}
          </div>
        </div>
        
        <div class="official-signature-block">
          <span class="official-signature-title">VERIFIED BY:</span>
          <div class="official-signature-field">
            ${hrVerifiedName ? `<div class="signature-stamp" style="font-size: 8px; border-color: #2ece89; color: #2ece89;">VERIFIED</div>` : ''}
          </div>
          <div class="official-signature-details">
            <strong>Name:</strong> ${hrVerifiedName || '-'}<br>
            <strong>Date:</strong> ${hrVerifiedDate || '-'}
          </div>
        </div>
        
        <div class="official-signature-block">
          <span class="official-signature-title">APPROVED BY:</span>
          <div class="official-signature-field">
            ${hrApprovedName ? `<div class="signature-stamp" style="font-size: 8px; border-color: #2ece89; color: #2ece89;">APPROVED</div>` : ''}
          </div>
          <div class="official-signature-details">
            <strong>Name:</strong> ${hrApprovedName || '-'}<br>
            <strong>Date:</strong> ${hrApprovedDate || '-'}
          </div>
        </div>
      </div>
    </div>
  `;

  // Wire Download PDF button
  const dlBtn = document.getElementById("warrant-pdf-download-btn");
  if (dlBtn) dlBtn.onclick = () => generateTravelPDF(id);

  const modal = document.getElementById("warrant-view-modal");
  if (modal) modal.classList.add("active");
}

function viewLeaveApplication(id) {
  const l = state.leaves.find(x => x.id === id);
  if (!l) { showToast("Leave record not found.", "error"); return; }
  const u = state.users[l.staffId] || {};

  const paper = document.getElementById("official-leave-paper-content");
  if (!paper) return;

  const statusColor = l.status === "Approved" ? "#1a7a4a" : l.status === "Rejected" ? "#b01212" : "#b06000";
  const statusBg    = l.status === "Approved" ? "#e6f9ef" : l.status === "Rejected" ? "#fdeaea" : "#fff7e6";
  const actionByName = l.lastActionBy || l.actionBy || "-";
  const actionDate   = l.actionDate || l.dateApplied || "-";

  paper.innerHTML = `
    <div class="official-warrant-header">
      <div class="official-warrant-brand">
        <img src="logo.png" class="official-warrant-logo-svg" alt="Ferrari Logo" style="object-fit: contain;">
        <div class="official-warrant-title-text">
          <h1 style="font-family:'Times New Roman',serif;font-size:15px;font-weight:900;letter-spacing:1px;">OFFICIAL FERRARI IMPORTER</h1>
          <h2 style="font-family:'Times New Roman',serif;font-size:13px;font-weight:700;letter-spacing:0.5px;">ITAL AUTO MALAYSIA</h2>
        </div>
      </div>
      <div style="text-align:right;">
        <h2 style="font-family:Arial,sans-serif;font-weight:900;font-size:16px;margin:0;color:#800000;letter-spacing:0.5px;">LEAVE APPLICATION</h2>
        <span style="font-size:9px;font-weight:bold;color:#333;">Ref No: ${l.id}</span><br>
        <span style="font-size:8px;color:#666;">Date Applied: ${l.dateApplied || '-'}</span>
      </div>
    </div>

    <div class="official-warrant-section-title">Applicant Details</div>
    <table class="official-warrant-table">
      <tr>
        <td style="width:20%;"><strong>Name</strong></td>
        <td style="width:30%;">${l.staffName}</td>
        <td style="width:20%;"><strong>Employee No.</strong></td>
        <td style="width:30%;">${l.staffId}</td>
      </tr>
      <tr>
        <td><strong>Position</strong></td>
        <td>${u.role || '-'}</td>
        <td><strong>Department</strong></td>
        <td>${u.department || '-'}</td>
      </tr>
      <tr>
        <td><strong>Reference No.</strong></td>
        <td>${l.referenceNo || '-'}</td>
        <td><strong>Relief Staff</strong></td>
        <td>${l.reliefStaff || '-'}</td>
      </tr>
    </table>

    <div class="official-warrant-section-title">Leave Details</div>
    <table class="official-warrant-table">
      <tr>
        <td style="width:30%;"><strong>Leave Type</strong></td>
        <td colspan="3">${(l.leaveType || '').toUpperCase()}</td>
      </tr>
      <tr>
        <td><strong>Start Date</strong></td>
        <td style="width:20%;">${formatHumanDate(l.startDate)}</td>
        <td style="width:20%;"><strong>End Date</strong></td>
        <td>${formatHumanDate(l.endDate)}</td>
      </tr>
      <tr>
        <td><strong>Total Days</strong></td>
        <td>${l.totalDays}</td>
        <td><strong>AM / PM</strong></td>
        <td>${l.ampm || 'Full Day'}</td>
      </tr>
      <tr>
        <td><strong>Reason / Remark</strong></td>
        <td colspan="3">${l.reason || '-'}</td>
      </tr>
      <tr>
        <td><strong>Approvers</strong></td>
        <td colspan="3">${l.approvers || getMockApprovers(l.staffId)}</td>
      </tr>
    </table>

    <div style="margin:16px 0;padding:10px 18px;border-radius:6px;background:${statusBg};border:1.5px solid ${statusColor};display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;">${l.status === 'Approved' ? '&#10003;' : l.status === 'Rejected' ? '&#10007;' : '&#8987;'}</span>
      <div>
        <div style="font-weight:800;font-size:13px;color:${statusColor};letter-spacing:0.5px;">STATUS: ${l.status.toUpperCase()}</div>
        ${l.remarks ? '<div style="font-size:11px;color:#555;margin-top:2px;">Remark: ' + l.remarks + '</div>' : ''}
        <div style="font-size:10px;color:#888;margin-top:2px;">Last action by: ${actionByName} on ${actionDate}</div>
      </div>
    </div>

    <div class="official-warrant-signatures">
      <div class="official-signature-block">
        <span class="official-signature-title">REQUESTED BY:</span>
        <div class="official-signature-field"><div class="signature-stamp">${l.staffName}</div></div>
        <div class="official-signature-details"><strong>Name:</strong> ${l.staffName}<br><strong>Date:</strong> ${l.dateApplied || '-'}</div>
      </div>
      <div class="official-signature-block">
        <span class="official-signature-title">VERIFIED BY HR:</span>
        <div class="official-signature-field">${l.status === 'Approved' ? '<div class="signature-stamp" style="font-size:8px;border-color:#2ece89;color:#2ece89;">HR VERIFIED</div>' : ''}</div>
        <div class="official-signature-details"><strong>Name:</strong> ${l.status === 'Approved' ? actionByName : '-'}<br><strong>Date:</strong> ${l.status === 'Approved' ? actionDate : '-'}</div>
      </div>
      <div class="official-signature-block">
        <span class="official-signature-title">APPROVED BY:</span>
        <div class="official-signature-field">${l.status === 'Approved' ? '<div class="signature-stamp" style="font-size:8px;border-color:#2ece89;color:#2ece89;">APPROVED</div>' : ''}</div>
        <div class="official-signature-details"><strong>Name:</strong> ${l.status === 'Approved' ? actionByName : '-'}<br><strong>Date:</strong> ${l.status === 'Approved' ? actionDate : '-'}</div>
      </div>
    </div>
  `;

  // Wire Download PDF button
  const dlBtn = document.getElementById("leave-pdf-download-btn");
  if (dlBtn) dlBtn.onclick = () => generateLeavePDF(id);

  const modal = document.getElementById("leave-view-modal");
  if (modal) modal.classList.add("active");
}

function closeLeaveViewModal() {
  const modal = document.getElementById("leave-view-modal");
  if (modal) modal.classList.remove("active");
}

function closeWarrantViewModal() {
  document.getElementById("warrant-view-modal").classList.remove("active");
}

function formatHumanDateTime(dtStr) {
  const dt = new Date(dtStr);
  const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit' };
  return `${dt.toLocaleDateString('en-US', optionsDate)} ${dt.toLocaleTimeString('en-US', optionsTime)}`;
}

// ========================================================
// E-LEAVE APPLY FORM LOGIC & STATS
// ========================================================

function getUserLeaveStats(user, leaveType) {
  const normalizedType = leaveType.toUpperCase();
  
  if (user.leaveStats && user.leaveStats[normalizedType]) {
    const stats = user.leaveStats[normalizedType];
    return {
      full: stats.full || 0,
      bf: stats.bf || 0,
      adjust: stats.adjust || 0,
      forfeit: stats.forfeit || 0,
      entitle: stats.entitle || 0,
      total: (stats.bf || 0) + (stats.entitle || 0) + (stats.adjust || 0) - (stats.forfeit || 0),
      taken: stats.taken || 0,
      balance: ((stats.bf || 0) + (stats.entitle || 0) + (stats.adjust || 0) - (stats.forfeit || 0)) - (stats.taken || 0)
    };
  }
  
  let full = 10;
  if (normalizedType.includes("ANNUAL")) {
    full = user.id.includes("HR-001") ? 30 : (user.id.includes("ST-001") ? 18 : 24);
  } else if (normalizedType.includes("SICK")) {
    full = user.id.includes("HR-001") ? 15 : 14;
  } else if (normalizedType.includes("EMERGENCY")) {
    full = 5;
  }
  
  const currentBalance = user.leaveBalances[leaveType] !== undefined 
    ? user.leaveBalances[leaveType] 
    : (user.leaveBalances[normalizedType] !== undefined ? user.leaveBalances[normalizedType] : full);
    
  const taken = Math.max(0, full - currentBalance);
  
  return {
    full: full,
    bf: 0,
    adjust: 0,
    forfeit: 0,
    entitle: full,
    total: full,
    taken: taken,
    balance: currentBalance
  };
}

function initLeaveApplyForm(isAdmin) {
  const prefix = isAdmin ? "leave-hr" : "leave-staff";
  
  const startEl = document.getElementById(`${prefix}-start-date`);
  const endEl = document.getElementById(`${prefix}-end-date`);
  
  // Set default dates to June 9, 2026 (matching system current local time date)
  const defaultDateStr = "2026-06-09";
  if (startEl && !startEl.value) startEl.value = defaultDateStr;
  if (endEl && !endEl.value) endEl.value = defaultDateStr;
  
  const refEl = document.getElementById(`${prefix}-ref-no`);
  const reasonEl = document.getElementById(`${prefix}-reason`);
  if (refEl) refEl.value = "";
  if (reasonEl) reasonEl.value = "";
  
  updateLeaveComputedDays(isAdmin);
  
  const deptSelect = document.getElementById(`${prefix}-dept`);
  const empSelect = document.getElementById(`${prefix}-employee`);
  
  if (isAdmin) {
    deptSelect.disabled = false;
    empSelect.disabled = false;
    
    deptSelect.onchange = () => {
      populateEmployees(isAdmin);
      updateLeaveStats(isAdmin);
    };
    
    empSelect.onchange = () => {
      updateLeaveStats(isAdmin);
    };
    
    populateEmployees(isAdmin);
  } else {
    deptSelect.value = state.currentUser.department || "Engineering";
    deptSelect.disabled = true;
    
    empSelect.innerHTML = `<option value="${state.currentUser.id}">${state.currentUser.name} [${state.currentUser.id}]</option>`;
    empSelect.value = state.currentUser.id;
    empSelect.disabled = true;
  }
  
  const typeSelect = document.getElementById(`${prefix}-type`);
  typeSelect.onchange = () => {
    updateLeaveStats(isAdmin);
  };
  
  startEl.onchange = () => {
    updateLeaveComputedDays(isAdmin);
  };
  endEl.onchange = () => {
    updateLeaveComputedDays(isAdmin);
  };
  
  updateLeaveStats(isAdmin);
}

function populateEmployees(isAdmin) {
  const prefix = isAdmin ? "leave-hr" : "leave-staff";
  const deptSelect = document.getElementById(`${prefix}-dept`);
  const empSelect = document.getElementById(`${prefix}-employee`);
  
  const selectedDept = deptSelect.value;
  empSelect.innerHTML = "";
  
  const filteredUsers = Object.values(state.users).filter(user => {
    if (selectedDept === "- ALL -") return true;
    return user.department === selectedDept;
  });
  
  filteredUsers.forEach(user => {
    const opt = document.createElement("option");
    opt.value = user.id;
    opt.textContent = `${user.name} [${user.id}]`;
    empSelect.appendChild(opt);
  });
  
  if (filteredUsers.length > 0) {
    const hasFerrari = filteredUsers.some(u => u.id === "IM047");
    if (hasFerrari) {
      empSelect.value = "IM047";
    } else {
      empSelect.value = filteredUsers[0].id;
    }
  }
}

function updateLeaveStats(isAdmin) {
  const prefix = isAdmin ? "leave-hr" : "leave-staff";
  const empSelect = document.getElementById(`${prefix}-employee`);
  const typeSelect = document.getElementById(`${prefix}-type`);
  
  const selectedUserId = empSelect.value;
  const selectedLeaveType = typeSelect.value;
  
  if (!selectedUserId || !selectedLeaveType) return;
  
  const user = state.users[selectedUserId];
  if (!user) return;
  
  const stats = getUserLeaveStats(user, selectedLeaveType);
  
  document.getElementById(`${prefix}-stat-full`).textContent = stats.full;
  document.getElementById(`${prefix}-stat-bf`).textContent = stats.bf;
  document.getElementById(`${prefix}-stat-adjust`).textContent = stats.adjust;
  document.getElementById(`${prefix}-stat-forfeit`).textContent = stats.forfeit;
  document.getElementById(`${prefix}-stat-entitle`).textContent = stats.entitle;
  document.getElementById(`${prefix}-stat-total`).textContent = stats.total;
  document.getElementById(`${prefix}-stat-taken`).textContent = stats.taken;
  document.getElementById(`${prefix}-stat-balance`).textContent = stats.balance;

  const approversEl = document.getElementById(`${prefix}-approvers`);
  if (approversEl) {
    if (isAdmin) {
      approversEl.innerHTML = "[Auto Approved]";
    } else {
      approversEl.innerHTML = getMockApprovers(selectedUserId);
    }
  }
}

function updateLeaveComputedDays(isAdmin) {
  const prefix = isAdmin ? "leave-hr" : "leave-staff";
  const startVal = document.getElementById(`${prefix}-start-date`).value;
  const endVal = document.getElementById(`${prefix}-end-date`).value;
  const numDaysEl = document.getElementById(`${prefix}-num-days`);
  
  if (startVal && endVal) {
    if (new Date(startVal) > new Date(endVal)) {
      numDaysEl.textContent = "0 (Invalid)";
      numDaysEl.style.color = "var(--danger)";
      return;
    }
    const days = calculateDays(startVal, endVal);
    numDaysEl.textContent = days;
    numDaysEl.style.color = "var(--text-primary)";
  } else {
    numDaysEl.textContent = "0";
  }
}

// Leave Form Submit (HR)
safeAddListener("leave-hr-apply-form", "submit", function(e) {
  e.preventDefault();
  
  const selectedUserId = document.getElementById("leave-hr-employee").value;
  const type = document.getElementById("leave-hr-type").value;
  const start = document.getElementById("leave-hr-start-date").value;
  const end = document.getElementById("leave-hr-end-date").value;
  const refNo = document.getElementById("leave-hr-ref-no").value.trim();
  const reason = document.getElementById("leave-hr-reason").value.trim();

  if (new Date(start) > new Date(end)) {
    showToast("Start date cannot be after end date.", "error");
    return;
  }

  const selectedUser = state.users[selectedUserId];
  if (!selectedUser) {
    showToast("Selected employee not found.", "error");
    return;
  }

  const totalDays = calculateDays(start, end);

  // Validate balance
  const balance = selectedUser.leaveBalances[type] !== undefined 
    ? selectedUser.leaveBalances[type] 
    : (selectedUser.leaveBalances[type.toUpperCase()] || 0);

  if (totalDays > balance) {
    showToast(`Insufficient balance. Requested ${totalDays} days of ${type}, but the employee only has ${balance} days remaining.`, "error");
    return;
  }

  // Deduct balance immediately (Auto Approved)
  const typeKey = type.toUpperCase();
  if (selectedUser.leaveBalances[typeKey] !== undefined) {
    selectedUser.leaveBalances[typeKey] = balance - totalDays;
  } else {
    selectedUser.leaveBalances[type] = balance - totalDays;
  }

  // Update statistics if available
  if (selectedUser.leaveStats && selectedUser.leaveStats[typeKey]) {
    selectedUser.leaveStats[typeKey].taken = (selectedUser.leaveStats[typeKey].taken || 0) + totalDays;
  }

  const newRequest = {
    id: `LV-${2000 + state.leaves.length + 1}`,
    staffId: selectedUser.id,
    staffName: selectedUser.name,
    leaveType: type,
    startDate: start,
    endDate: end,
    totalDays: totalDays,
    reason: reason,
    referenceNo: refNo,
    reliefStaff: "-",
    status: "Approved",
    remarks: "Auto Approved by System",
    dateApplied: "2026-06-09"
  };

  state.leaves.push(newRequest);
  saveDatabase();

  this.reset();
  showToast("Leave request applied and auto-approved successfully!");
  triggerConfetti();

  state.activeSection = "sec-leave-hr-my";
  navigateUI();
});

// Leave Form Submit (Staff)
safeAddListener("leave-staff-apply-form", "submit", function(e) {
  e.preventDefault();
  
  const type = document.getElementById("leave-staff-type").value;
  const start = document.getElementById("leave-staff-start-date").value;
  const end = document.getElementById("leave-staff-end-date").value;
  const refNo = document.getElementById("leave-staff-ref-no").value.trim();
  const reason = document.getElementById("leave-staff-reason").value.trim();

  if (new Date(start) > new Date(end)) {
    showToast("Start date cannot be after end date.", "error");
    return;
  }

  const totalDays = calculateDays(start, end);
  const selectedUser = state.users[state.currentUser.id];

  // Validate balance
  const balance = selectedUser.leaveBalances[type] !== undefined 
    ? selectedUser.leaveBalances[type] 
    : (selectedUser.leaveBalances[type.toUpperCase()] || 0);

  if (totalDays > balance) {
    showToast(`Insufficient balance. Requested ${totalDays} days of ${type}, but you only have ${balance} days remaining.`, "error");
    return;
  }

  const initialStatus = (state.currentUser.id === "IM018" || state.currentUser.isAdmin) ? "Approved" : "Pending Recommendation";

  if (initialStatus === "Approved") {
    const typeKey = type.toUpperCase();
    if (selectedUser.leaveBalances[typeKey] !== undefined) {
      selectedUser.leaveBalances[typeKey] = balance - totalDays;
    } else {
      selectedUser.leaveBalances[type] = balance - totalDays;
    }
    if (selectedUser.leaveStats && selectedUser.leaveStats[typeKey]) {
      selectedUser.leaveStats[typeKey].taken = (selectedUser.leaveStats[typeKey].taken || 0) + totalDays;
    }
  }

  const newRequest = {
    id: `LV-${2000 + state.leaves.length + 1}`,
    staffId: state.currentUser.id,
    staffName: state.currentUser.name,
    leaveType: type,
    startDate: start,
    endDate: end,
    totalDays: totalDays,
    reason: reason,
    referenceNo: refNo,
    reliefStaff: "-",
    status: initialStatus,
    remarks: initialStatus === "Approved" ? "Auto Approved by System" : "",
    dateApplied: new Date().toISOString().split('T')[0]
  };

  if (initialStatus === "Pending Recommendation") {
    // Send email to HOD (Carter Logan)
    const bodyText = `Dear Recommender,

${newRequest.staffName} has requested E-Leave recommendation.

Leave Type : ${newRequest.leaveType}
From : ${formatHumanDate(newRequest.startDate)}
To : ${formatHumanDate(newRequest.endDate)}
Total Days : ${newRequest.totalDays} Days
Reason : ${newRequest.reason}

Please click the link to go to e-Leave system : http://localhost:3000/login.html

Regards:
[e-Leave]

Do not reply to this email. This is an auto notification from e-Leave`;

    sendMockEmail("carter.logan@italauto.com.my", "Carter Logan", `Action Required: Leave Recommendation for ${newRequest.staffName}`, bodyText);
  }

  state.leaves.push(newRequest);
  saveDatabase();

  this.reset();
  showToast(initialStatus === "Approved" ? "Leave request applied and auto-approved!" : "Leave request submitted successfully! Pending HOD recommendation. Opening PDF...");
  triggerConfetti();
  setTimeout(() => generateLeavePDF(newRequest.id), 800);

  state.activeSection = "sec-leave-staff-my";
  navigateUI();
});


// ==========================================
// MODAL REVIEW CONTROLS
// ==========================================

function openApprovalModal(requestId, systemType, actionType) {
  const modal = document.getElementById("approval-modal");
  const modalTitle = document.getElementById("modal-approval-title");
  const modalSummary = document.getElementById("modal-request-summary");
  const remarksLabel = document.getElementById("modal-remarks-label");
  const remarksInput = document.getElementById("modal-remarks-input");
  
  document.getElementById("modal-request-id").value = requestId;
  document.getElementById("modal-request-type").value = systemType;
  document.getElementById("modal-action-type").value = actionType;

  remarksInput.value = "";

  // Pull matching item details
  if (systemType === "travel") {
    const travel = state.travels.find(t => t.id === requestId);
    modalTitle.textContent = `${actionType === 'approve' ? 'Approve' : 'Reject'} Travel Warrant: ${requestId}`;
    modalSummary.innerHTML = `
      <strong>Applicant:</strong> ${travel.staffName} (${travel.staffId})<br>
      <strong>Destination:</strong> ${travel.destination}<br>
      <strong>Travel Dates:</strong> ${formatHumanDate(travel.startDate)} to ${formatHumanDate(travel.endDate)}<br>
      <strong>Est. Budget / Transport:</strong> $${travel.budget} via ${travel.transport}
    `;
  } else {
    const leave = state.leaves.find(l => l.id === requestId);
    modalTitle.textContent = `${actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request: ${requestId}`;
    modalSummary.innerHTML = `
      <strong>Applicant:</strong> ${leave.staffName} (${leave.staffId})<br>
      <strong>Leave Type:</strong> ${leave.leaveType}<br>
      <strong>Leave Dates:</strong> ${formatHumanDate(leave.startDate)} to ${formatHumanDate(leave.endDate)} (${leave.totalDays} Days)<br>
      <strong>Reason:</strong> ${leave.reason}
    `;
  }

  // Make remarks field required for rejections
  if (actionType === "reject") {
    remarksLabel.textContent = "Reason for Rejection (Required)";
    remarksInput.placeholder = "Please explain the reason for rejecting this request...";
  } else {
    remarksLabel.textContent = "Approver Remarks (Optional)";
    remarksInput.placeholder = "Add optional notes or instructions for the staff...";
  }

  modal.classList.add("active");
}

function closeApprovalModal() {
  document.getElementById("approval-modal").classList.remove("active");
}

// Attach events to Modal Buttons
safeAddListener("modal-close-btn", "click", closeApprovalModal);
safeAddListener("modal-cancel-btn", "click", closeApprovalModal);

safeAddListener("modal-confirm-btn", "click", function() {
  const reqId = document.getElementById("modal-request-id").value;
  const sysType = document.getElementById("modal-request-type").value;
  const actionType = document.getElementById("modal-action-type").value;
  const remarks = document.getElementById("modal-remarks-input").value.trim();

  // Validate remarks if rejecting
  if (actionType === "reject" && !remarks) {
    showToast("Rejection reason is required.", "error");
    return;
  }

  if (sysType === "travel") {
    const travel = state.travels.find(t => t.id === reqId);
    if (actionType === "recommend") {
      travel.status = "Pending Approval";
      travel.remarks = remarks || "Recommended by HOD";
      travel.actionBy = state.currentUser.name;

      const days = calculateDays(travel.startDate, travel.endDate);
      const bodyText = `Dear Approver,

${travel.staffName} has requested Travel Warrant approval (Recommended by HOD).

Day of Travel : ${days} days
From : ${formatHumanDate(travel.startDate)}
To : ${formatHumanDate(travel.endDate)}
Travel purpose : ${travel.purpose}

Please click the link to go to e-Travel Warrant system : http://localhost:3000/login.html

Regards:
[e-TravelWarrant]

Do not reply to this email. This is an auto notification from e-TravelWarrant`;

      sendMockEmail("eleanor.vance@italauto.com.my", "Eleanor Vance", `Action Required: Travel Warrant Approval for ${travel.staffName}`, bodyText);
    } else {
      travel.status = actionType === "approve" ? "Approved" : "Rejected";
      travel.remarks = remarks;
      if (actionType === "approve") {
        travel.approvedBy = state.currentUser.name;
      }
      travel.actionBy = state.currentUser.name;
    }
  } else {
    const leave = state.leaves.find(l => l.id === reqId);
    
    if (actionType === "recommend") {
      leave.status = "Pending Approval";
      leave.remarks = remarks || "Recommended by HOD";
      leave.lastActionBy = state.currentUser.name;

      const bodyText = `Dear Approver,

${leave.staffName} has requested E-Leave approval (Recommended by HOD).

Leave Type : ${leave.leaveType}
From : ${formatHumanDate(leave.startDate)}
To : ${formatHumanDate(leave.endDate)}
Total Days : ${leave.totalDays} Days
Reason : ${leave.reason}

Please click the link to go to e-Leave system : http://localhost:3000/login.html

Regards:
[e-Leave]

Do not reply to this email. This is an auto notification from e-Leave`;

      sendMockEmail("eleanor.vance@italauto.com.my", "Eleanor Vance", `Action Required: Leave Approval for ${leave.staffName}`, bodyText);
    } else if (actionType === "approve") {
      const applicant = state.users[leave.staffId];
      const leaveTypeKey = leave.leaveType.toUpperCase();
      
      const bal = applicant.leaveBalances[leaveTypeKey] !== undefined 
        ? applicant.leaveBalances[leaveTypeKey] 
        : (applicant.leaveBalances[leave.leaveType] || 0);
      
      if (bal < leave.totalDays) {
        showToast("Cannot approve leave. Staff balance is insufficient.", "error");
        closeApprovalModal();
        return;
      }
      
      if (applicant.leaveBalances[leaveTypeKey] !== undefined) {
        applicant.leaveBalances[leaveTypeKey] = bal - leave.totalDays;
      } else {
        applicant.leaveBalances[leave.leaveType] = bal - leave.totalDays;
      }
      
      if (applicant.leaveStats && applicant.leaveStats[leaveTypeKey]) {
        applicant.leaveStats[leaveTypeKey].taken = (applicant.leaveStats[leaveTypeKey].taken || 0) + leave.totalDays;
      }
      
      leave.status = "Approved";
      leave.remarks = remarks;
      leave.lastActionBy = state.currentUser.name;
    } else {
      leave.status = "Rejected";
      leave.remarks = remarks;
      leave.lastActionBy = state.currentUser.name;
    }
  }

  saveDatabase();
  closeApprovalModal();
  
  showToast(`Request ${reqId} has been successfully ${actionType === "approve" ? "approved" : actionType === "recommend" ? "recommended" : "rejected"}.`);
  if (actionType === "approve") triggerConfetti();
  
  navigateUI();
});

// ==========================================
// CALENDAR MONTH NAVIGATION
// ==========================================

function handleCalendarNav(direction, isHR = true) {
  if (direction === "prev") {
    state.activeCalendarMonth--;
    if (state.activeCalendarMonth < 0) {
      state.activeCalendarMonth = 11;
      state.activeCalendarYear--;
    }
  } else {
    state.activeCalendarMonth++;
    if (state.activeCalendarMonth > 11) {
      state.activeCalendarMonth = 0;
      state.activeCalendarYear++;
    }
  }

  if (isHR) {
    renderHRCalendar();
  } else {
    renderStaffCalendar();
  }
}

// Calendar Navigation Listeners
safeAddListener("calendar-hr-prev-btn", "click", () => handleCalendarNav("prev", true));
safeAddListener("calendar-hr-next-btn", "click", () => handleCalendarNav("next", true));
safeAddListener("calendar-staff-prev-btn", "click", () => handleCalendarNav("prev", false));
safeAddListener("calendar-staff-next-btn", "click", () => handleCalendarNav("next", false));

// ==========================================
// SYSTEM SCREEN CHANGER BINDINGS
// ==========================================

safeAddListener("card-travel-system", "click", () => {
  const isAdmin = state.currentUser?.isAdmin;
  window.location.href = isAdmin ? "travel_hr.html" : "travel_st.html";
});

safeAddListener("card-leave-system", "click", () => {
  const isAdmin = state.currentUser?.isAdmin;
  window.location.href = isAdmin ? "e-leave_hr.html" : "e-leave_st.html";
});

safeAddListener("sidebar-switch-system-btn", "click", switchSystemModule);
safeAddListener("header-quick-switch-btn", "click", switchSystemModule);

safeAddListener("sidebar-logout-btn", "click", handleLogout);
safeAddListener("selector-logout-btn", "click", handleLogout);

// Mobile Toggle Sidebar
safeAddListener("mobile-menu-toggle", "click", function() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("active");
});

// ==========================================
// INITIALIZATION ON DOCUMENT READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initDatabase();

  // Load session from local storage
  const sessionUserStr = localStorage.getItem("ferrari_hrms_session_user");
  if (sessionUserStr) {
    state.currentUser = JSON.parse(sessionUserStr);
  }

  // Detect current page
  const path = window.location.pathname;
  const isLoginPage    = path.endsWith("login.html");
  const isLogoutPage   = path.endsWith("logout.html");
  const isTravelPage   = path.endsWith("travel.html") || path.endsWith("travel_hr.html") || path.endsWith("travel_st.html");
  const isLeavePage    = path.endsWith("e-leave.html") || path.endsWith("e-leave_hr.html") || path.endsWith("e-leave_st.html");
  const isHRPage       = path.endsWith("travel_hr.html") || path.endsWith("e-leave_hr.html");
  const isStaffPage    = path.endsWith("travel_st.html") || path.endsWith("e-leave_st.html");
  const isIndexPage    = path.endsWith("index.html") || path === "/" || path.endsWith("/");

  // Page Routing & Session Enforcement
  if (isLogoutPage) {
    localStorage.removeItem("ferrari_hrms_session_user");
    state.currentUser = null;
    state.activeSystem = null;
    state.activeSection = null;
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  if (!state.currentUser && !isLoginPage) {
    window.location.href = "login.html";
    return;
  }

  if (state.currentUser && isLoginPage) {
    window.location.href = "index.html";
    return;
  }

  // Role enforcement on split pages: redirect if wrong role lands here
  if (state.currentUser && isHRPage && !state.currentUser.isAdmin) {
    // Non-admin on an HR page → redirect to staff equivalent
    if (path.endsWith("travel_hr.html")) { window.location.href = "travel_st.html"; return; }
    if (path.endsWith("e-leave_hr.html")) { window.location.href = "e-leave_st.html"; return; }
  }
  if (state.currentUser && isStaffPage && state.currentUser.isAdmin) {
    // Admin on a staff page → redirect to HR equivalent
    if (path.endsWith("travel_st.html")) { window.location.href = "travel_hr.html"; return; }
    if (path.endsWith("e-leave_st.html")) { window.location.href = "e-leave_hr.html"; return; }
  }

  // Set system context
  if (isTravelPage) {
    state.activeSystem = "travel";
  } else if (isLeavePage) {
    state.activeSystem = "leave";
  } else {
    state.activeSystem = null;
  }
  state.activeSection = null; // resets to default for current page

  // Update UI user panels safely on load
  if (state.currentUser) {
    const user = state.currentUser;
    const welcomeMsg = document.getElementById("selector-welcome-msg");
    if (welcomeMsg) welcomeMsg.innerHTML = `Welcome back, <span>${user.name}</span>!`;

    const sidebarName = document.getElementById("sidebar-user-name");
    if (sidebarName) sidebarName.textContent = user.name;

    const sidebarRole = document.getElementById("sidebar-user-role");
    if (sidebarRole) sidebarRole.textContent = user.role;

    const sidebarId = document.getElementById("sidebar-user-id");
    if (sidebarId) sidebarId.textContent = user.id;

    const initials = user.initials || user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const sidebarAvatar = document.getElementById("sidebar-user-avatar");
    if (sidebarAvatar) sidebarAvatar.textContent = initials;

    const headerName = document.getElementById("header-user-name");
    if (headerName) headerName.textContent = user.name;

    const headerRole = document.getElementById("header-user-role");
    if (headerRole) headerRole.textContent = user.role;

    const headerAvatar = document.getElementById("header-user-avatar");
    if (headerAvatar) headerAvatar.textContent = initials;
  }

  // Login form submission
  safeAddListener("login-form", "submit", function(e) {
    e.preventDefault();
    const inputEl = document.getElementById("staff-id-input");
    if (inputEl) {
      handleLogin(inputEl.value);
    }
  });

  // Social/Demo login shortcuts
  safeAddListener("social-google", "click", function() {
    const inputEl = document.getElementById("staff-id-input");
    if (inputEl) inputEl.value = "HR-001";
    handleLogin("HR-001");
  });

  safeAddListener("social-github", "click", function() {
    const inputEl = document.getElementById("staff-id-input");
    if (inputEl) inputEl.value = "ST-001";
    handleLogin("ST-001");
  });

  safeAddListener("social-facebook", "click", function() {
    const inputEl = document.getElementById("staff-id-input");
    if (inputEl) inputEl.value = "IM047";
    handleLogin("IM047");
  });

  // Demo buttons bindings
  document.querySelectorAll(".demo-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      const inputEl = document.getElementById("staff-id-input");
      if (inputEl) inputEl.value = id;
      handleLogin(id);
    });
  });

  // Setup default calendar navigation date boundaries
  state.activeCalendarMonth = state.currentCalendarDate.getMonth();
  state.activeCalendarYear = state.currentCalendarDate.getFullYear();

  if (isTravelPage) {
    setupTravelCalculators();
  }
  
  navigateUI();
  // Wire up department → employee cascading dropdowns on all forms
  initDeptEmployeeSelects();

  // Show notification badge dot on bell if there are announcements
  const badge = document.getElementById("announcement-badge");
  if (badge && state.announcements && state.announcements.length > 0) {
    badge.classList.add("active");
    badge.style.display = "block";
  }
});


// ==========================================
// FAQ, ANNOUNCEMENTS, AND PROFILE MODALS
// ==========================================

function ensureHeaderModalsExist() {
  // 1. FAQ Modal
  if (!document.getElementById("faq-modal")) {
    const m = document.createElement("div");
    m.id = "faq-modal";
    m.className = "modal-overlay";
    m.innerHTML = `
      <div class="modal-container" style="max-width: 600px; width: 90%;">
        <div class="modal-header" style="background-color: var(--bg-card); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-weight: 700; color: var(--ferrari-red); display: flex; align-items: center; gap: 8px; margin: 0;">
            <i class="fa-regular fa-circle-question"></i> System FAQ & Guide
          </h3>
          <button type="button" class="modal-close-btn" onclick="closeFaqModal()">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow-y: auto; padding: 1.5rem; background-color: var(--bg-body);">
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <div style="background: var(--bg-card); border-left: 4px solid var(--ferrari-red); padding: 12px 16px; border-radius: 6px; box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 6px 0; color: var(--text-primary); font-size: 0.95rem; font-weight: 700;">1. How do I apply for annual leave?</h4>
              <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">Navigate to the <strong>Apply Leave</strong> section in the sidebar. Select your leave type, dates, and relief staff. The system will calculate the total days and submit it. For staff, annual leaves are auto-approved if you have sufficient balance!</p>
            </div>

            <div style="background: var(--bg-card); border-left: 4px solid var(--ferrari-red); padding: 12px 16px; border-radius: 6px; box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 6px 0; color: var(--text-primary); font-size: 0.95rem; font-weight: 700;">2. How long does Travel Warrant approval take?</h4>
              <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">Travel warrant applications require administrator or head of department review. Approval usually takes 1-2 business days. You can track status in the <strong>My Travel Warrants</strong> section.</p>
            </div>

            <div style="background: var(--bg-card); border-left: 4px solid var(--ferrari-red); padding: 12px 16px; border-radius: 6px; box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 6px 0; color: var(--text-primary); font-size: 0.95rem; font-weight: 700;">3. Can I update my personal email or password?</h4>
              <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">Yes! Click on your profile avatar or name box in the top-right header to open the <strong>User Profile Edit</strong> modal. There, you can update your email, profile details, and password.</p>
            </div>

            <div style="background: var(--bg-card); border-left: 4px solid var(--ferrari-red); padding: 12px 16px; border-radius: 6px; box-shadow: var(--shadow-sm);">
              <h4 style="margin: 0 0 6px 0; color: var(--text-primary); font-size: 0.95rem; font-weight: 700;">4. Who can create company announcements?</h4>
              <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">Only authorized HR department users can publish or edit company announcements. Other staff members can read announcements by clicking the bell icon.</p>
            </div>

          </div>
        </div>
        <div class="modal-footer" style="background-color: var(--bg-card); border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" onclick="closeFaqModal()" style="padding: 8px 16px; font-weight: 600;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }

  // 2. Announcement Modal
  if (!document.getElementById("announcement-modal")) {
    const m = document.createElement("div");
    m.id = "announcement-modal";
    m.className = "modal-overlay";
    m.innerHTML = `
      <div class="modal-container" style="max-width: 650px; width: 90%;">
        <div class="modal-header" style="background-color: var(--bg-card); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-weight: 700; color: var(--ferrari-red); display: flex; align-items: center; gap: 8px; margin: 0;">
            <i class="fa-regular fa-bell"></i> Company Announcements
          </h3>
          <button type="button" class="modal-close-btn" onclick="closeAnnouncementsModal()">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 60vh; overflow-y: auto; padding: 1.5rem; background-color: var(--bg-body);">
          
          <!-- List View -->
          <div id="announcement-list-view">
            <!-- HR actions bar (shown only for HR admins) -->
            <div id="announcement-hr-actions" style="margin-bottom: 1rem; display: none;">
              <button type="button" class="btn" onclick="showCreateAnnouncementForm()" style="padding: 6px 12px; font-size: 0.85rem; font-weight: 600;">
                <i class="fa-solid fa-plus"></i> New Announcement
              </button>
            </div>
            
            <div id="announcement-list-container" style="display: flex; flex-direction: column; gap: 1rem;">
              <!-- Items will be injected here dynamically -->
            </div>
          </div>
          
          <!-- Create/Edit Form View -->
          <div id="announcement-form-view" style="display: none;">
            <h4 id="announcement-form-title" style="margin-top: 0; margin-bottom: 1rem; font-weight: 700; color: var(--text-primary);">Create Announcement</h4>
            <input type="hidden" id="announcement-edit-id">
            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="announcement-title-input" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Title</label>
              <input type="text" id="announcement-title-input" class="form-input" style="width: 100%; box-sizing: border-box;" placeholder="Enter announcement title...">
            </div>
            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="announcement-content-input" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Content</label>
              <textarea id="announcement-content-input" class="form-textarea" style="width: 100%; height: 120px; box-sizing: border-box;" placeholder="Enter announcement body..."></textarea>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="hideAnnouncementForm()">Cancel</button>
              <button type="button" class="btn" onclick="saveAnnouncement()">Save</button>
            </div>
          </div>

        </div>
        <div class="modal-footer" style="background-color: var(--bg-card); border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" onclick="closeAnnouncementsModal()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }

  // 3. Profile Modal
  if (!document.getElementById("profile-modal")) {
    const m = document.createElement("div");
    m.id = "profile-modal";
    m.className = "modal-overlay";
    m.innerHTML = `
      <div class="modal-container" style="max-width: 500px; width: 90%;">
        <div class="modal-header" style="background-color: var(--bg-card); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-weight: 700; color: var(--ferrari-red); display: flex; align-items: center; gap: 8px; margin: 0;">
            <i class="fa-regular fa-user"></i> My Profile
          </h3>
          <button type="button" class="modal-close-btn" onclick="closeProfileModal()">&times;</button>
        </div>
        <div class="modal-body" style="background-color: var(--bg-body); padding: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <div id="profile-modal-avatar" style="width: 60px; height: 60px; border-radius: 50%; background-color: var(--ferrari-red); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; text-transform: uppercase;">
              EV
            </div>
            <div>
              <h4 id="profile-modal-full-name" style="margin: 0; color: var(--text-primary); font-size: 1.1rem; font-weight: 700;">Eleanor Vance</h4>
              <span id="profile-modal-role" style="color: var(--text-secondary); font-size: 0.85rem;">HR Director</span>
              <br>
              <span id="profile-modal-staff-id" style="color: var(--ferrari-red); font-size: 0.8rem; font-weight: 600;">ID: HR-001</span>
            </div>
          </div>
          
          <form id="profile-edit-form" onsubmit="handleProfileUpdate(event)">
            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="profile-name-input" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Full Name</label>
              <input type="text" id="profile-name-input" class="form-input" style="width: 100%; box-sizing: border-box;" required>
            </div>
            
            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="profile-email-input" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Email Address</label>
              <input type="email" id="profile-email-input" class="form-input" style="width: 100%; box-sizing: border-box;" required>
            </div>

            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="profile-avatar-input" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Avatar Initials (max 2 chars)</label>
              <input type="text" id="profile-avatar-input" class="form-input" style="width: 100%; box-sizing: border-box;" maxlength="2" required>
            </div>
            
            <div id="profile-password-field-container" class="form-field" style="margin-bottom: 1.25rem;">
              <label for="profile-password-input" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Change Password</label>
              <input type="password" id="profile-password-input" class="form-input" style="width: 100%; box-sizing: border-box;" placeholder="Leave blank to keep current password">
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="closeProfileModal()">Cancel</button>
              <button type="submit" class="btn">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }

  // 4. Mock Email Inbox Modal
  if (!document.getElementById("email-inbox-modal")) {
    const m = document.createElement("div");
    m.id = "email-inbox-modal";
    m.className = "modal-overlay";
    m.innerHTML = `
      <div class="modal-container" style="max-width: 750px; width: 90%;">
        <div class="modal-header" style="background-color: var(--bg-card); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-weight: 700; color: var(--ferrari-red); display: flex; align-items: center; gap: 8px; margin: 0;">
            <i class="fa-regular fa-envelope"></i> Mock Email Notification Center
          </h3>
          <button type="button" class="modal-close-btn" onclick="closeEmailInboxModal()">&times;</button>
        </div>
        <div class="modal-body" style="background-color: var(--bg-body); padding: 1.5rem; display: flex; gap: 1rem; height: 450px; max-height: 60vh;">
          <!-- Left list pane -->
          <div id="email-inbox-list" style="width: 40%; border-right: 1px solid var(--border-color); overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 8px;">
            <!-- Items injected dynamically -->
          </div>
          <!-- Right preview pane -->
          <div id="email-inbox-preview" style="width: 60%; overflow-y: auto; background: var(--bg-card); border: 1px solid var(--border-color); padding: 16px; border-radius: 8px; display: flex; flex-direction: column;">
            <div style="color: var(--text-secondary); text-align: center; margin: auto; font-style: italic;">
              Select an email from the left pane to view details.
            </div>
          </div>
        </div>
        <div class="modal-footer" style="background-color: var(--bg-card); border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn btn-secondary" onclick="clearAllMockEmails()" style="background: rgba(176,0,0,0.1); border-color: rgba(176,0,0,0.3); color: var(--ferrari-red); font-size: 0.8rem; padding: 6px 12px;">Clear Inbox</button>
          <button type="button" class="btn btn-secondary" onclick="closeEmailInboxModal()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }
}

function openFaqModal() {
  ensureHeaderModalsExist();
  document.getElementById("faq-modal").classList.add("active");
}

function closeFaqModal() {
  document.getElementById("faq-modal").classList.remove("active");
}

function openAnnouncementsModal() {
  ensureHeaderModalsExist();
  renderAnnouncementsList();
  
  const isHR = state.currentUser && (state.currentUser.isAdmin || state.currentUser.id.startsWith("HR"));
  const hrActions = document.getElementById("announcement-hr-actions");
  if (hrActions) {
    hrActions.style.display = isHR ? "block" : "none";
  }
  
  hideAnnouncementForm();
  document.getElementById("announcement-modal").classList.add("active");
  
  const badge = document.getElementById("announcement-badge");
  if (badge) {
    badge.classList.remove("active");
    badge.style.display = "none";
  }
}

function closeAnnouncementsModal() {
  document.getElementById("announcement-modal").classList.remove("active");
}

function renderAnnouncementsList() {
  const container = document.getElementById("announcement-list-container");
  if (!container) return;
  container.innerHTML = "";
  
  const list = state.announcements || [];
  const isHR = state.currentUser && (state.currentUser.isAdmin || state.currentUser.id.startsWith("HR"));
  
  if (list.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; padding: 2rem 0;">No announcements published.</div>`;
    return;
  }
  
  [...list].reverse().forEach(ann => {
    const card = document.createElement("div");
    card.style.background = "var(--bg-card)";
    card.style.border = "1px solid var(--border-color)";
    card.style.borderRadius = "8px";
    card.style.padding = "12px 16px";
    card.style.boxShadow = "var(--shadow-sm)";
    
    let hrBtns = "";
    if (isHR) {
      hrBtns = `
        <div style="display: flex; gap: 8px; font-size: 0.8rem; margin-top: 8px;">
          <a href="#" onclick="event.preventDefault(); editAnnouncement('${ann.id}')" style="color: var(--ferrari-red); font-weight: 600; text-decoration: underline;">Edit</a>
          <span style="color: var(--border-color);">|</span>
          <a href="#" onclick="event.preventDefault(); deleteAnnouncement('${ann.id}')" style="color: var(--text-secondary); font-weight: 600; text-decoration: underline;">Delete</a>
        </div>
      `;
    }
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <h4 style="margin: 0; color: var(--text-primary); font-size: 1rem; font-weight: 700;">${ann.title}</h4>
        <span style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap;">${ann.date}</span>
      </div>
      <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.45; word-break: break-word;">${ann.content}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-style: italic;">By: ${ann.author}</span>
        ${hrBtns}
      </div>
    `;
    container.appendChild(card);
  });
}

function showCreateAnnouncementForm() {
  document.getElementById("announcement-list-view").style.display = "none";
  document.getElementById("announcement-form-view").style.display = "block";
  document.getElementById("announcement-form-title").textContent = "New Announcement";
  document.getElementById("announcement-edit-id").value = "";
  document.getElementById("announcement-title-input").value = "";
  document.getElementById("announcement-content-input").value = "";
}

function hideAnnouncementForm() {
  document.getElementById("announcement-list-view").style.display = "block";
  document.getElementById("announcement-form-view").style.display = "none";
}

function editAnnouncement(id) {
  const ann = state.announcements.find(a => a.id === id);
  if (!ann) return;
  
  document.getElementById("announcement-list-view").style.display = "none";
  document.getElementById("announcement-form-view").style.display = "block";
  document.getElementById("announcement-form-title").textContent = "Edit Announcement";
  document.getElementById("announcement-edit-id").value = ann.id;
  document.getElementById("announcement-title-input").value = ann.title;
  document.getElementById("announcement-content-input").value = ann.content;
}

function deleteAnnouncement(id) {
  if (confirm("Are you sure you want to delete this announcement?")) {
    state.announcements = state.announcements.filter(a => a.id !== id);
    saveDatabase();
    renderAnnouncementsList();
    showToast("Announcement deleted successfully.", "success");
  }
}

function saveAnnouncement() {
  const title = document.getElementById("announcement-title-input").value.trim();
  const content = document.getElementById("announcement-content-input").value.trim();
  const editId = document.getElementById("announcement-edit-id").value;
  
  if (!title || !content) {
    showToast("Please fill in both title and content.", "error");
    return;
  }
  
  if (editId) {
    const ann = state.announcements.find(a => a.id === editId);
    if (ann) {
      ann.title = title;
      ann.content = content;
      ann.date = new Date().toISOString().split('T')[0];
    }
  } else {
    const newAnn = {
      id: "ann-" + Date.now(),
      title: title,
      content: content,
      date: new Date().toISOString().split('T')[0],
      author: state.currentUser ? state.currentUser.name : "HR Department"
    };
    state.announcements.push(newAnn);
  }
  
  saveDatabase();
  hideAnnouncementForm();
  renderAnnouncementsList();
  showToast("Announcement saved successfully.", "success");
}

function openProfileModal() {
  ensureHeaderModalsExist();
  
  const u = state.users[state.currentUser.id] || state.currentUser;
  const initials = u.initials || u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  
  document.getElementById("profile-modal-avatar").textContent = initials;
  document.getElementById("profile-modal-full-name").textContent = u.name;
  document.getElementById("profile-modal-role").textContent = u.role || "Employee";
  document.getElementById("profile-modal-staff-id").textContent = "ID: " + u.id;
  
  document.getElementById("profile-name-input").value = u.name;
  document.getElementById("profile-email-input").value = u.email || (u.name.toLowerCase().replace(/\s+/g, ".") + "@italauto.com.my");
  document.getElementById("profile-avatar-input").value = initials;
  document.getElementById("profile-password-input").value = "";
  
  const hasPassword = !!u.password;
  const pwdContainer = document.getElementById("profile-password-field-container");
  if (pwdContainer) {
    pwdContainer.style.display = hasPassword ? "block" : "none";
  }
  
  document.getElementById("profile-modal").classList.add("active");
}

function closeProfileModal() {
  document.getElementById("profile-modal").classList.remove("active");
}

function handleProfileUpdate(event) {
  event.preventDefault();
  
  const name = document.getElementById("profile-name-input").value.trim();
  const email = document.getElementById("profile-email-input").value.trim();
  const initials = document.getElementById("profile-avatar-input").value.trim().toUpperCase();
  const password = document.getElementById("profile-password-input").value.trim();
  
  if (!name || !email || !initials) {
    showToast("Please fill in name, email and initials.", "error");
    return;
  }
  
  const uid = state.currentUser.id;
  const userObj = state.users[uid];
  
  if (userObj) {
    userObj.name = name;
    userObj.email = email;
    userObj.initials = initials;
    const hasPassword = !!userObj.password;
    if (hasPassword && password) {
      // Validate strict requirements if they are management
      const validation = validatePasswordRequirements(password, userObj.isManagement);
      if (!validation.valid) {
        showToast(validation.message, "error");
        return;
      }
      userObj.password = password;
      userObj.passwordChanged = true; // reset change flag
    }
    
    state.currentUser.name = name;
    state.currentUser.email = email;
    state.currentUser.initials = initials;
    
    saveDatabase();
    
    const headerAvatar = document.getElementById("header-user-avatar");
    const headerName = document.getElementById("header-user-name");
    if (headerAvatar) headerAvatar.textContent = initials;
    if (headerName) headerName.textContent = name;
    
    const sidebarAvatar = document.getElementById("sidebar-user-avatar");
    const sidebarName = document.getElementById("sidebar-user-name");
    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    if (sidebarName) sidebarName.textContent = name;
    
    closeProfileModal();
    showToast("Profile updated successfully!", "success");
  } else {
    showToast("Error updating profile.", "error");
  }
}


// Expose functions to window for inline HTML onclick handlers
window.handleFirstLoginReset = handleFirstLoginReset;
window.openApprovalModal = openApprovalModal;
window.closeApprovalModal = closeApprovalModal;
window.viewTravelWarrant = viewTravelWarrant;
window.closeWarrantViewModal = closeWarrantViewModal;
window.viewLeaveApplication = viewLeaveApplication;
window.closeLeaveViewModal = closeLeaveViewModal;
window.toggleExpandLeaveRow = toggleExpandLeaveRow;
window.toggleExpandTravelRow = toggleExpandTravelRow;
window.generateLeavePDF = generateLeavePDF;
// ==========================================
// SYSTEM ADMINISTRATOR: USER MANAGEMENT
// ==========================================

function renderHRUserManagement() {
  const container = document.getElementById("sec-hr-user-management");
  if (!container) return;

  container.innerHTML = `
    <div class="card-block">
      <div class="card-block-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="margin: 0; color: var(--text-primary); font-size: 1.25rem; font-weight: 700;">
          <i class="fa-solid fa-users-gear" style="color: var(--ferrari-red); margin-right: 8px;"></i> Staff User Directory
        </h3>
        <button type="button" class="btn" onclick="openAddUserModal()" style="padding: 8px 16px; font-weight: 600;">
          <i class="fa-solid fa-plus"></i> Add New Employee
        </button>
      </div>

      <div class="table-responsive">
        <table class="custom-table" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 12px;">Staff ID</th>
              <th style="text-align: left; padding: 12px;">Full Name</th>
              <th style="text-align: left; padding: 12px;">Designated Role</th>
              <th style="text-align: left; padding: 12px;">Department</th>
              <th style="text-align: left; padding: 12px;">Admin Rights</th>
              <th style="text-align: left; padding: 12px;">Management Policy</th>
              <th style="text-align: left; padding: 12px;">Status</th>
              <th style="text-align: center; padding: 12px;">Actions</th>
            </tr>
          </thead>
          <tbody id="user-management-tbody">
            <!-- Dynamically populated rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = document.getElementById("user-management-tbody");
  tbody.innerHTML = "";

  Object.keys(state.users).forEach(uid => {
    const user = state.users[uid];
    const isSelf = user.id === state.currentUser.id;
    const statusText = user.isInactive ? "Inactive" : "Active";
    const statusClass = user.isInactive ? "badge rejected" : "badge approved";
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-weight: 700; color: var(--ferrari-red);">${user.id}</td>
      <td style="font-weight: 600;">${user.name}</td>
      <td>${user.role || "-"}</td>
      <td>${user.department || "-"}</td>
      <td>
        <span class="badge ${user.isAdmin ? 'approved' : 'pending'}" style="font-size: 0.75rem;">
          ${user.isAdmin ? 'Admin' : 'Staff'}
        </span>
      </td>
      <td>
        <span class="badge ${user.isManagement ? 'approved' : 'pending'}" style="font-size: 0.75rem; background: ${user.isManagement ? 'rgba(0,180,0,0.1)' : 'transparent'}; border-color: ${user.isManagement ? '#2ece89' : 'var(--border-color)'}; color: ${user.isManagement ? '#2ece89' : 'var(--text-secondary)'};">
          ${user.isManagement ? 'Management' : 'Standard'}
        </span>
      </td>
      <td><span class="${statusClass}">${statusText}</span></td>
      <td style="text-align: center; white-space: nowrap;">
        <button class="btn btn-secondary" onclick="openEditUserModal('${user.id}')" style="padding: 4px 8px; font-size: 0.8rem; margin-right: 6px;">
          <i class="fa-solid fa-edit"></i> Edit
        </button>
        ${!isSelf ? `
          <button class="btn btn-secondary" onclick="toggleUserActiveState('${user.id}')" style="padding: 4px 8px; font-size: 0.8rem; margin-right: 6px;">
            <i class="fa-solid ${user.isInactive ? 'fa-check' : 'fa-ban'}"></i> ${user.isInactive ? 'Activate' : 'Deactivate'}
          </button>
          <button class="btn" onclick="deleteUserRecord('${user.id}')" style="padding: 4px 8px; font-size: 0.8rem; background: var(--ferrari-red); color: white;">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        ` : `<span style="color: var(--text-secondary); font-style: italic; font-size: 0.8rem;">(Logged In)</span>`}
      </td>
    `;
    tbody.appendChild(row);
  });
}

function ensureUserEditModalExists() {
  if (!document.getElementById("user-edit-modal")) {
    const m = document.createElement("div");
    m.id = "user-edit-modal";
    m.className = "modal-overlay";
    m.innerHTML = `
      <div class="modal-container" style="max-width: 500px; width: 90%;">
        <div class="modal-header" style="background-color: var(--bg-card); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
          <h3 id="user-modal-title" style="font-weight: 700; color: var(--ferrari-red); display: flex; align-items: center; gap: 8px; margin: 0;">
            <i class="fa-solid fa-user-plus"></i> Add Employee Record
          </h3>
          <button type="button" class="modal-close-btn" onclick="closeUserEditModal()">&times;</button>
        </div>
        <div class="modal-body" style="background-color: var(--bg-body); padding: 1.5rem;">
          <form id="user-edit-form" onsubmit="handleUserSave(event)">
            <input type="hidden" id="user-modal-action-mode">
            
            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="user-modal-id" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Staff ID</label>
              <input type="text" id="user-modal-id" class="form-input" style="width: 100%; box-sizing: border-box;" required placeholder="e.g. IM060">
            </div>

            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="user-modal-name" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Full Name</label>
              <input type="text" id="user-modal-name" class="form-input" style="width: 100%; box-sizing: border-box;" required placeholder="Enter full name">
            </div>

            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="user-modal-role" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Designated Role</label>
              <input type="text" id="user-modal-role" class="form-input" style="width: 100%; box-sizing: border-box;" required placeholder="e.g. Executive, Senior Manager">
            </div>

            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="user-modal-dept" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Department</label>
              <select id="user-modal-dept" class="form-input" style="width: 100%; box-sizing: border-box;" required>
                <option value="ED OFFICE">ED OFFICE</option>
                <option value="PRESIDENT OFFICE">PRESIDENT OFFICE</option>
                <option value="GENERAL MANAGER">GENERAL MANAGER</option>
                <option value="HUMAN RESOURCE & ADMINISTRATION">HUMAN RESOURCE & ADMINISTRATION</option>
                <option value="GOVERNMENT LIAISON & LOGISTIC">GOVERNMENT LIAISON & LOGISTIC</option>
                <option value="FINANCE">FINANCE</option>
                <option value="SALES">SALES</option>
                <option value="MARKETING & COMMUNICATIONS">MARKETING & COMMUNICATIONS</option>
                <option value="AFTER SALES">AFTER SALES</option>
                <option value="SPECIAL PROJECT">SPECIAL PROJECT</option>
              </select>
            </div>

            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="user-modal-password" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; display: block; color: var(--text-primary);">Account Password (optional)</label>
              <input type="password" id="user-modal-password" class="form-input" style="width: 100%; box-sizing: border-box;" placeholder="Leave blank for no password, or set a temp password">
            </div>

            <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; margin-top: 1rem;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); cursor: pointer;">
                <input type="checkbox" id="user-modal-is-admin" style="width: 16px; height: 16px;">
                Administrator Level Access
              </label>
              
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); cursor: pointer;">
                <input type="checkbox" id="user-modal-is-management" style="width: 16px; height: 16px;">
                Management User Policy
              </label>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="closeUserEditModal()">Cancel</button>
              <button type="submit" class="btn" id="user-modal-submit-btn">Save Employee</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }
}

function openAddUserModal() {
  ensureUserEditModalExists();
  document.getElementById("user-modal-title").innerHTML = '<i class="fa-solid fa-user-plus"></i> Add Employee Record';
  document.getElementById("user-modal-action-mode").value = "add";
  document.getElementById("user-modal-id").readOnly = false;
  
  const numbers = Object.keys(state.users)
    .filter(k => k.startsWith("IM") && !isNaN(k.substring(2)))
    .map(k => parseInt(k.substring(2)));
  const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const formattedNum = String(nextNum).padStart(3, "0");
  
  document.getElementById("user-modal-id").value = "IM" + formattedNum;
  document.getElementById("user-modal-name").value = "";
  document.getElementById("user-modal-role").value = "";
  document.getElementById("user-modal-dept").value = "SALES";
  document.getElementById("user-modal-password").value = "";
  document.getElementById("user-modal-is-admin").checked = false;
  document.getElementById("user-modal-is-management").checked = false;
  
  document.getElementById("user-edit-modal").classList.add("active");
}

function openEditUserModal(userId) {
  ensureUserEditModalExists();
  const u = state.users[userId];
  if (!u) return;

  document.getElementById("user-modal-title").innerHTML = '<i class="fa-solid fa-user-pen"></i> Edit Employee Record';
  document.getElementById("user-modal-action-mode").value = "edit";
  document.getElementById("user-modal-id").value = u.id;
  document.getElementById("user-modal-id").readOnly = true;
  document.getElementById("user-modal-name").value = u.name;
  document.getElementById("user-modal-role").value = u.role || "";
  document.getElementById("user-modal-dept").value = u.department || "SALES";
  document.getElementById("user-modal-password").value = u.password || "";
  document.getElementById("user-modal-is-admin").checked = !!u.isAdmin;
  document.getElementById("user-modal-is-management").checked = !!u.isManagement;
  
  document.getElementById("user-edit-modal").classList.add("active");
}

function closeUserEditModal() {
  document.getElementById("user-edit-modal").classList.remove("active");
}

function handleUserSave(event) {
  event.preventDefault();
  const mode = document.getElementById("user-modal-action-mode").value;
  const id = document.getElementById("user-modal-id").value.trim();
  const name = document.getElementById("user-modal-name").value.trim();
  const role = document.getElementById("user-modal-role").value.trim();
  const dept = document.getElementById("user-modal-dept").value;
  const password = document.getElementById("user-modal-password").value.trim();
  const isAdmin = document.getElementById("user-modal-is-admin").checked;
  const isManagement = document.getElementById("user-modal-is-management").checked;

  if (!id || !name || !role) {
    showToast("Please fill in ID, name and role.", "error");
    return;
  }

  if (mode === "add" && state.users[id]) {
    showToast(`User ID ${id} already exists. Please choose a unique ID.`, "error");
    return;
  }

  const userObj = state.users[id] || { id: id };
  userObj.name = name;
  userObj.role = role;
  userObj.department = dept;
  userObj.isAdmin = isAdmin;
  userObj.isManagement = isManagement;
  
  if (password) {
    if (isManagement) {
      const validation = validatePasswordRequirements(password, true);
      if (!validation.valid) {
        showToast("Strict policy error: " + validation.message, "error");
        return;
      }
    }
    userObj.password = password;
    if (userObj.password !== state.users[id]?.password) {
      userObj.passwordChanged = false;
    }
  } else {
    delete userObj.password;
    delete userObj.passwordChanged;
  }

  if (mode === "add") {
    userObj.leaveBalances = { "ANNUAL LEAVE": 18, "SICK LEAVE": 14, "EMERGENCY LEAVE": 5 };
  }

  state.users[id] = userObj;
  saveDatabase();
  closeUserEditModal();
  renderHRUserManagement();
  showToast(`Employee ${name} saved successfully.`, "success");
}

function toggleUserActiveState(userId) {
  const u = state.users[userId];
  if (!u) return;
  u.isInactive = !u.isInactive;
  saveDatabase();
  renderHRUserManagement();
  showToast(`Employee ${u.name} has been ${u.isInactive ? 'deactivated' : 'activated'}.`, "info");
}

function deleteUserRecord(userId) {
  const u = state.users[userId];
  if (!u) return;
  if (confirm(`Are you sure you want to permanently delete employee ${u.name} (ID: ${userId})? This will delete their records.`)) {
    delete state.users[userId];
    saveDatabase();
    renderHRUserManagement();
    showToast(`Employee record for ${u.name} deleted successfully.`, "info");
  }
}

// ==========================================
// MOCK EMAIL NOTIFICATION CENTER
// ==========================================

function sendMockEmail(toEmail, toName, subject, bodyText) {
  const emails = JSON.parse(localStorage.getItem("ferrari_hrms_emails")) || [];
  const newEmail = {
    id: "em-" + (emails.length + 1),
    from: "e-System Notification <auto-notify@italauto.com.my>",
    to: `${toName} <${toEmail}>`,
    subject: subject,
    body: bodyText,
    date: new Date().toLocaleString(),
    unread: true
  };
  emails.unshift(newEmail);
  localStorage.setItem("ferrari_hrms_emails", JSON.stringify(emails));
  updateEmailBadge();
}

function updateEmailBadge() {
  const emails = JSON.parse(localStorage.getItem("ferrari_hrms_emails")) || [];
  const unreadCount = emails.filter(e => e.unread).length;
  
  const badge = document.getElementById("email-inbox-badge");
  if (badge) {
    if (unreadCount > 0) {
      badge.style.display = "flex";
      badge.textContent = unreadCount;
    } else {
      badge.style.display = "none";
    }
  }
}

function ensureHeaderInboxIconExists() {
  const headerRight = document.querySelector(".header-right");
  if (headerRight && !document.getElementById("email-inbox-btn")) {
    const inboxBtn = document.createElement("div");
    inboxBtn.className = "header-icon-btn notification-btn";
    inboxBtn.id = "email-inbox-btn";
    inboxBtn.title = "Mock Mail Center";
    inboxBtn.onclick = () => window.openEmailInboxModal();
    inboxBtn.style.position = "relative";
    inboxBtn.style.cursor = "pointer";
    inboxBtn.innerHTML = `
      <i class="fa-regular fa-envelope"></i>
      <span class="notification-badge-dot" id="email-inbox-badge" style="display: none; background-color: var(--ferrari-red); color: white; border: 2px solid var(--bg-card); font-size: 0.65rem; height: 16px; width: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; top: -4px; right: -4px; font-weight: 700;"></span>
    `;
    
    const switchBtn = document.getElementById("header-quick-switch-btn");
    const profileBtn = document.getElementById("profile-btn") || document.querySelector(".header-profile");
    
    if (profileBtn) {
      headerRight.insertBefore(inboxBtn, profileBtn);
    } else if (switchBtn) {
      headerRight.insertBefore(inboxBtn, switchBtn);
    } else {
      headerRight.appendChild(inboxBtn);
    }
  }
  updateEmailBadge();
}

function openEmailInboxModal() {
  ensureHeaderModalsExist();
  document.getElementById("email-inbox-modal").classList.add("active");
  renderEmailList();
}

function closeEmailInboxModal() {
  document.getElementById("email-inbox-modal").classList.remove("active");
}

function renderEmailList() {
  const emails = JSON.parse(localStorage.getItem("ferrari_hrms_emails")) || [];
  const listContainer = document.getElementById("email-inbox-list");
  if (!listContainer) return;

  if (emails.length === 0) {
    listContainer.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding-top: 2rem; font-style: italic; font-size: 0.85rem;">No emails received.</div>`;
    document.getElementById("email-inbox-preview").innerHTML = `
      <div style="color: var(--text-secondary); text-align: center; margin: auto; font-style: italic;">
        Select an email from the left pane to view details.
      </div>
    `;
    return;
  }

  listContainer.innerHTML = "";
  emails.forEach(email => {
    const item = document.createElement("div");
    item.style.cssText = `
      padding: 10px;
      border: 1px solid ${email.unread ? 'var(--ferrari-red)' : 'var(--border-color)'};
      background: ${email.unread ? 'rgba(176,0,0,0.05)' : 'var(--bg-card)'};
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.2s ease;
    `;
    item.onmouseenter = () => { item.style.borderColor = "var(--ferrari-red)"; };
    item.onmouseleave = () => { item.style.borderColor = email.unread ? 'var(--ferrari-red)' : 'var(--border-color)'; };
    item.onclick = () => previewMockEmail(email.id);

    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; font-size: 0.75rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 120px;">
          ${email.to.split("<")[0].trim()}
        </span>
        <span style="font-size: 0.65rem; color: var(--text-secondary);">${email.date.split(",")[1]?.trim() || email.date}</span>
      </div>
      <div style="font-weight: ${email.unread ? '800' : '500'}; font-size: 0.8rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
        ${email.subject}
      </div>
    `;
    listContainer.appendChild(item);
  });
}

function previewMockEmail(emailId) {
  const emails = JSON.parse(localStorage.getItem("ferrari_hrms_emails")) || [];
  const email = emails.find(e => e.id === emailId);
  if (!email) return;

  email.unread = false;
  localStorage.setItem("ferrari_hrms_emails", JSON.stringify(emails));
  updateEmailBadge();
  renderEmailList();

  const preview = document.getElementById("email-inbox-preview");
  if (!preview) return;

  preview.innerHTML = `
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 12px; font-size: 0.85rem; line-height: 1.4;">
      <div><strong>From:</strong> ${email.from}</div>
      <div><strong>To:</strong> ${email.to}</div>
      <div><strong>Date:</strong> ${email.date}</div>
      <div style="font-size: 1rem; font-weight: 700; margin-top: 6px; color: var(--ferrari-red);">${email.subject}</div>
    </div>
    <div style="font-size: 0.85rem; color: var(--text-primary); white-space: pre-wrap; line-height: 1.5; flex-grow: 1; font-family: monospace; background: rgba(0,0,0,0.15); padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
      ${email.body}
    </div>
  `;
}

function clearAllMockEmails() {
  localStorage.setItem("ferrari_hrms_emails", JSON.stringify([]));
  updateEmailBadge();
  renderEmailList();
}

window.renderHRUserManagement = renderHRUserManagement;
window.openAddUserModal = openAddUserModal;
window.openEditUserModal = openEditUserModal;
window.closeUserEditModal = closeUserEditModal;
window.handleUserSave = handleUserSave;
window.toggleUserActiveState = toggleUserActiveState;
window.deleteUserRecord = deleteUserRecord;

window.openEmailInboxModal = openEmailInboxModal;
window.closeEmailInboxModal = closeEmailInboxModal;
window.clearAllMockEmails = clearAllMockEmails;

window.generateTravelPDF = generateTravelPDF;
window.printWarrantDocument = function() {
  window.print();
};
window.openFaqModal = openFaqModal;
window.closeFaqModal = closeFaqModal;
window.openAnnouncementsModal = openAnnouncementsModal;
window.closeAnnouncementsModal = closeAnnouncementsModal;
window.showCreateAnnouncementForm = showCreateAnnouncementForm;
window.hideAnnouncementForm = hideAnnouncementForm;
window.editAnnouncement = editAnnouncement;
window.deleteAnnouncement = deleteAnnouncement;
window.saveAnnouncement = saveAnnouncement;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.handleProfileUpdate = handleProfileUpdate;
