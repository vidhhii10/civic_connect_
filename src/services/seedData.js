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

export const INITIAL_ISSUES = [
  {
    id: "CC-101",
    timestamp: "2026-09-21T09:30:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Street Lights",
    description: "Lights not working outside sunshine apartment. The light remains off which causes poor visibility and safety hazards at night.",
    address: "Mahavir Nagar, Kandivali West",
    latitude: 19.2062,
    longitude: 72.8398,
    status: "Pending",
    percentage: 0,
    adminNotes: "Complaint logged with BMC Ward R/South Electrical Dept. Inspection scheduled within 24 hours.",
    photo: "/images/sample-issues/street-light.jpg",
    audio: null
  },
  {
    id: "CC-102",
    timestamp: "2026-09-20T14:15:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Pothole",
    description: "Deep pothole near SV Road junction causing traffic bottleneck and serious hazard for two-wheeler commuters.",
    address: "Poisar, Kandivali West",
    latitude: 19.2015,
    longitude: 72.8465,
    status: "In Progress",
    percentage: 50,
    adminNotes: "Road maintenance contractor dispatched. Bitumen cold-mix resurfacing scheduled during tonight's traffic window.",
    photo: "/images/sample-issues/pothole.jpg",
    audio: null
  },
  {
    id: "CC-103",
    timestamp: "2026-09-19T11:00:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Garbage",
    description: "Overflowing garbage bin near municipal school gate attracting strays and spreading foul odor throughout the residential area.",
    address: "Aarey Milk Colony, Goregaon East",
    latitude: 19.1485,
    longitude: 72.8812,
    status: "Completed",
    percentage: 100,
    adminNotes: "Solid Waste Management compactor cleared the container and disinfected the site on 20-09-2026.",
    photo: "/images/sample-issues/garbage.jpg",
    audio: null
  },
  {
    id: "CC-104",
    timestamp: "2026-09-18T16:45:00.000Z",
    reporterName: "Priya Sharma",
    contact: "981234567",
    category: "Water Leakage",
    description: "High pressure municipal main pipeline ruptured near Metro Pillar 142. Potable drinking water is gushing onto the roadway.",
    address: "Link Road, Malad West",
    latitude: 19.1865,
    longitude: 72.8340,
    status: "In Progress",
    percentage: 50,
    adminNotes: "Hydraulic Engineering team isolated valve #4. Pipe weld repair underway; expected restoration by 6 PM.",
    photo: "/images/sample-issues/water-leak.jpg",
    audio: null
  },
  {
    id: "CC-105",
    timestamp: "2026-09-17T18:20:00.000Z",
    reporterName: "Rahul Verma",
    contact: "982345678",
    category: "Exposed Wires",
    description: "Fallen overhead cable with bare copper wires hanging at head level across pedestrian footway.",
    address: "Juhu Tara Road, Juhu",
    latitude: 19.0988,
    longitude: 72.8267,
    status: "Pending",
    percentage: 0,
    adminNotes: "Urgent ticket created. Utility company dispatch crew alerted for immediate line insulation.",
    photo: "/images/sample-issues/street-light.jpg",
    audio: null
  },
  {
    id: "CC-106",
    timestamp: "2026-09-16T12:10:00.000Z",
    reporterName: "Krish Patel",
    contact: "987654322",
    category: "Drainage",
    description: "Stormwater drain choked with plastic debris leading to stagnant rainwater accumulation outside station subway.",
    address: "Station Road, Borivali West",
    latitude: 19.2290,
    longitude: 72.8570,
    status: "Completed",
    percentage: 100,
    adminNotes: "Suction de-silting machine deployed. Storm drain thoroughly unclogged and flow restored.",
    photo: "/images/sample-issues/pothole.jpg",
    audio: null
  }
];
