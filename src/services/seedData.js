// Civic Connect Initial Seed Data (Mumbai Prototype)

export const INITIAL_USERS = [
  {
    id: "usr-01",
    name: "Krish Patel",
    contact: "987654322",
    email: "krish.patel@example.com",
    role: "Active Citizen",
    address: "Mahavir Nagar, Kandivali West, Mumbai",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Krish"
  },
  {
    id: "usr-02",
    name: "Priya Sharma",
    contact: "981234567",
    email: "priya.sharma@example.com",
    role: "Resident",
    address: "Link Road, Malad West, Mumbai",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya"
  },
  {
    id: "usr-03",
    name: "Rahul Verma",
    contact: "982345678",
    email: "rahul.verma@example.com",
    role: "Civic Volunteer",
    address: "Juhu Tara Road, Juhu, Mumbai",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rahul"
  }
];

export const ISSUE_CATEGORIES = [
  "Street Lights",
  "Exposed Wires",
  "Water Leakage",
  "Drainage",
  "Public Toilet",
  "Garbage",
  "Pothole",
  "Other"
];

export const MUNICIPAL_DEPARTMENTS = [
  "Electrical & Street Lighting Dept",
  "Roads & Traffic Works (PWD)",
  "Water Supply & Hydraulic Dept",
  "Solid Waste Management (SWM)",
  "Stormwater Drainage Dept",
  "Health & Sanitation Dept",
  "Disaster & Emergency Cell"
];

export const ISSUE_PRIORITIES = ["Critical", "High", "Medium", "Low"];

export const FIELD_OFFICERS = [
  {
    id: "off-01",
    name: "Officer Sunita Rao",
    role: "Sub-Engineer",
    department: "Electrical & Street Lighting Dept",
    phone: "9820022334"
  },
  {
    id: "off-02",
    name: "Officer Rajesh Kadam",
    role: "Senior Inspector",
    department: "Roads & Traffic Works (PWD)",
    phone: "9820011223"
  },
  {
    id: "off-03",
    name: "Officer Vikram Patil",
    role: "Hydraulic Specialist",
    department: "Water Supply & Hydraulic Dept",
    phone: "9820044556"
  },
  {
    id: "off-04",
    name: "Officer Amit Shinde",
    role: "Chief Overseer",
    department: "Solid Waste Management (SWM)",
    phone: "9820033445"
  },
  {
    id: "off-05",
    name: "Officer Meera Nair",
    role: "Sanitation Supervisor",
    department: "Health & Sanitation Dept",
    phone: "9820055667"
  },
  {
    id: "off-06",
    name: "Officer Sanjay More",
    role: "Disaster Cell Inspector",
    department: "Disaster & Emergency Cell",
    phone: "9820066778"
  }
];

export const INITIAL_ISSUES = [
  {
    id: "CC-101",
    timestamp: "2026-09-21T09:30:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Street Lights",
    priority: "Medium",
    department: "Electrical & Street Lighting Dept",
    assignedOfficer: "Officer Sunita Rao",
    description: "Lights not working outside sunshine apartment. The light remains off which causes poor visibility and safety hazards at night.",
    address: "Mahavir Nagar, Kandivali West",
    latitude: 19.2062,
    longitude: 72.8398,
    status: "Pending",
    percentage: 0,
    adminNotes: "Complaint logged with BMC Ward R/South Electrical Dept. Inspection scheduled within 24 hours.",
    photo: "/images/sample-issues/street-light.jpg",
    audio: null,
    statusHistory: [
      {
        id: "sh-101-1",
        timestamp: "2026-09-21T09:30:00.000Z",
        status: "Pending",
        updatedBy: "Krish Patel (Citizen)",
        note: "Issue reported via Civic Connect Mobile App"
      },
      {
        id: "sh-101-2",
        timestamp: "2026-09-21T10:15:00.000Z",
        status: "Pending",
        updatedBy: "Ward R/South Triage Desk",
        note: "Assigned to Electrical & Street Lighting Dept. Dispatched to Officer Sunita Rao."
      }
    ],
    internalNotes: [
      {
        id: "note-101-1",
        timestamp: "2026-09-21T10:20:00.000Z",
        author: "Officer Sunita Rao",
        role: "Sub-Engineer",
        text: "Photocell unit on pole #SL-42 appears burned out. Replacement scheduled for evening maintenance run."
      }
    ]
  },
  {
    id: "CC-102",
    timestamp: "2026-09-20T14:15:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Pothole",
    priority: "High",
    department: "Roads & Traffic Works (PWD)",
    assignedOfficer: "Officer Rajesh Kadam",
    description: "Deep pothole near SV Road junction causing traffic bottleneck and serious hazard for two-wheeler commuters.",
    address: "Poisar, Kandivali West",
    latitude: 19.2015,
    longitude: 72.8465,
    status: "In Progress",
    percentage: 50,
    adminNotes: "Road maintenance contractor dispatched. Bitumen cold-mix resurfacing scheduled during tonight's traffic window.",
    photo: "/images/sample-issues/pothole.jpg",
    audio: null,
    statusHistory: [
      {
        id: "sh-102-1",
        timestamp: "2026-09-20T14:15:00.000Z",
        status: "Pending",
        updatedBy: "Krish Patel (Citizen)",
        note: "Issue submitted by citizen"
      },
      {
        id: "sh-102-2",
        timestamp: "2026-09-20T15:00:00.000Z",
        status: "In Progress",
        updatedBy: "Officer Rajesh Kadam",
        note: "On-site assessment completed. Crew dispatched with cold-mix asphalt truck."
      }
    ],
    internalNotes: [
      {
        id: "note-102-1",
        timestamp: "2026-09-20T15:05:00.000Z",
        author: "Officer Rajesh Kadam",
        role: "Senior Inspector",
        text: "Traffic police notified to divert slow traffic while patching crew operates tonight between 11 PM and 3 AM."
      }
    ]
  },
  {
    id: "CC-103",
    timestamp: "2026-09-19T11:00:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Garbage",
    priority: "Medium",
    department: "Solid Waste Management (SWM)",
    assignedOfficer: "Officer Amit Shinde",
    description: "Overflowing garbage bin near municipal school gate attracting strays and spreading foul odor throughout the residential area.",
    address: "Aarey Milk Colony, Goregaon East",
    latitude: 19.1485,
    longitude: 72.8812,
    status: "Resolved",
    percentage: 100,
    adminNotes: "Solid Waste Management compactor cleared the container and disinfected the site on 20-09-2026.",
    photo: "/images/sample-issues/garbage.jpg",
    audio: null,
    statusHistory: [
      {
        id: "sh-103-1",
        timestamp: "2026-09-19T11:00:00.000Z",
        status: "Pending",
        updatedBy: "Krish Patel",
        note: "Grievance submitted"
      },
      {
        id: "sh-103-2",
        timestamp: "2026-09-19T13:30:00.000Z",
        status: "In Progress",
        updatedBy: "Officer Amit Shinde",
        note: "Compactor vehicle assigned route A-14"
      },
      {
        id: "sh-103-3",
        timestamp: "2026-09-20T08:45:00.000Z",
        status: "Resolved",
        updatedBy: "Officer Amit Shinde",
        note: "Container cleared, bleaching powder spread around perimeter. Resolved within SLA."
      }
    ],
    internalNotes: [
      {
        id: "note-103-1",
        timestamp: "2026-09-20T08:50:00.000Z",
        author: "Officer Amit Shinde",
        role: "Chief Overseer",
        text: "Clean-up verified via photographic proof uploaded to BMC SWM portal."
      }
    ]
  },
  {
    id: "CC-104",
    timestamp: "2026-09-18T16:45:00.000Z",
    reporterName: "Priya Sharma",
    contact: "981234567",
    category: "Water Leakage",
    priority: "Critical",
    department: "Water Supply & Hydraulic Dept",
    assignedOfficer: "Officer Vikram Patil",
    description: "High pressure municipal main pipeline ruptured near Metro Pillar 142. Potable drinking water is gushing onto the roadway.",
    address: "Link Road, Malad West",
    latitude: 19.1865,
    longitude: 72.8340,
    status: "In Progress",
    percentage: 50,
    adminNotes: "Hydraulic Engineering team isolated valve #4. Pipe weld repair underway; expected restoration by 6 PM.",
    photo: "/images/sample-issues/water-leak.jpg",
    audio: null,
    statusHistory: [
      {
        id: "sh-104-1",
        timestamp: "2026-09-18T16:45:00.000Z",
        status: "Pending",
        updatedBy: "Priya Sharma",
        note: "Citizen emergency alert logged"
      },
      {
        id: "sh-104-2",
        timestamp: "2026-09-18T17:10:00.000Z",
        status: "In Progress",
        updatedBy: "Officer Vikram Patil",
        note: "Valve shut-off completed. Heavy excavation machine on site for sleeve clamp installation."
      }
    ],
    internalNotes: [
      {
        id: "note-104-1",
        timestamp: "2026-09-18T17:30:00.000Z",
        author: "Officer Vikram Patil",
        role: "Hydraulic Specialist",
        text: "Rupture occurred on 300mm CI main pipeline due to soil shifting. Clamping underway."
      }
    ]
  },
  {
    id: "CC-105",
    timestamp: "2026-09-17T18:20:00.000Z",
    reporterName: "Rahul Verma",
    contact: "982345678",
    category: "Exposed Wires",
    priority: "Critical",
    department: "Electrical & Street Lighting Dept",
    assignedOfficer: "Officer Sunita Rao",
    description: "Fallen overhead cable with bare copper wires hanging at head level across pedestrian footway.",
    address: "Juhu Tara Road, Juhu",
    latitude: 19.0988,
    longitude: 72.8267,
    status: "Pending",
    percentage: 0,
    adminNotes: "Urgent ticket created. Utility company dispatch crew alerted for immediate line insulation.",
    photo: "/images/sample-issues/street-light.jpg",
    audio: null,
    statusHistory: [
      {
        id: "sh-105-1",
        timestamp: "2026-09-17T18:20:00.000Z",
        status: "Pending",
        updatedBy: "Rahul Verma",
        note: "High hazard grievance registered"
      }
    ],
    internalNotes: [
      {
        id: "note-105-1",
        timestamp: "2026-09-17T18:35:00.000Z",
        author: "Officer Sunita Rao",
        role: "Sub-Engineer",
        text: "Alert sent to Adani Electricity emergency cell. Temporary barricading requested from local beat police."
      }
    ]
  },
  {
    id: "CC-106",
    timestamp: "2026-09-16T12:10:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Drainage",
    priority: "Medium",
    department: "Stormwater Drainage Dept",
    assignedOfficer: "Officer Rajesh Kadam",
    description: "Stormwater drain choked with plastic debris leading to stagnant rainwater accumulation outside station subway.",
    address: "Station Road, Borivali West",
    latitude: 19.2290,
    longitude: 72.8570,
    status: "Resolved",
    percentage: 100,
    adminNotes: "Suction de-silting machine deployed. Storm drain thoroughly unclogged and flow restored.",
    photo: "/images/sample-issues/pothole.jpg",
    audio: null,
    statusHistory: [
      {
        id: "sh-106-1",
        timestamp: "2026-09-16T12:10:00.000Z",
        status: "Pending",
        updatedBy: "Krish Patel",
        note: "Complaint submitted"
      },
      {
        id: "sh-106-2",
        timestamp: "2026-09-16T14:00:00.000Z",
        status: "In Progress",
        updatedBy: "Officer Rajesh Kadam",
        note: "Drain suction vehicle deployed"
      },
      {
        id: "sh-106-3",
        timestamp: "2026-09-17T10:00:00.000Z",
        status: "Resolved",
        updatedBy: "Officer Rajesh Kadam",
        note: "Storm drain cleaned and flushed. Silt suction completed."
      }
    ],
    internalNotes: [
      {
        id: "note-106-1",
        timestamp: "2026-09-17T10:15:00.000Z",
        author: "Officer Rajesh Kadam",
        role: "Senior Inspector",
        text: "Station subway culvert cleared of plastic bottles and dry waste. Water flow normal."
      }
    ]
  }
];
