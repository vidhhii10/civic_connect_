import { INITIAL_ISSUES, INITIAL_USERS } from "./seedData";

const STORAGE_KEY_ISSUES = "civic_connect_issues_v1";
const STORAGE_KEY_ACTIVE_USER = "civic_connect_active_user_v1";

const getDefaultDepartment = (category) => {
  switch (category) {
    case "Street Lights":
    case "Exposed Wires":
      return "Electrical & Street Lighting Dept";
    case "Water Leakage":
      return "Water Supply & Hydraulic Dept";
    case "Drainage":
      return "Stormwater Drainage Dept";
    case "Garbage":
      return "Solid Waste Management (SWM)";
    case "Pothole":
      return "Roads & Traffic Works (PWD)";
    case "Public Toilet":
      return "Health & Sanitation Dept";
    default:
      return "Roads & Traffic Works (PWD)";
  }
};

const getDefaultPriority = (category) => {
  switch (category) {
    case "Exposed Wires":
    case "Water Leakage":
      return "Critical";
    case "Pothole":
    case "Street Lights":
      return "High";
    case "Garbage":
    case "Drainage":
      return "Medium";
    default:
      return "Low";
  }
};

const getDefaultOfficer = (department) => {
  switch (department) {
    case "Electrical & Street Lighting Dept":
      return "Officer Sunita Rao";
    case "Roads & Traffic Works (PWD)":
      return "Officer Rajesh Kadam";
    case "Water Supply & Hydraulic Dept":
      return "Officer Vikram Patil";
    case "Solid Waste Management (SWM)":
      return "Officer Amit Shinde";
    case "Stormwater Drainage Dept":
      return "Officer Rajesh Kadam";
    case "Health & Sanitation Dept":
      return "Officer Meera Nair";
    default:
      return "Officer Sanjay More";
  }
};

const normalizeIssue = (issue) => {
  const department = issue.department || getDefaultDepartment(issue.category);
  const priority = issue.priority || getDefaultPriority(issue.category);
  const assignedOfficer = issue.assignedOfficer || getDefaultOfficer(department);

  const statusHistory = Array.isArray(issue.statusHistory) && issue.statusHistory.length > 0
    ? issue.statusHistory
    : [
        {
          id: `sh-init-${issue.id}`,
          timestamp: issue.timestamp || new Date().toISOString(),
          status: issue.status || "Pending",
          updatedBy: issue.reporterName ? `${issue.reporterName} (Citizen)` : "Citizen Portal",
          note: "Grievance logged in municipal records"
        }
      ];

  const internalNotes = Array.isArray(issue.internalNotes)
    ? issue.internalNotes
    : (issue.adminNotes ? [
        {
          id: `note-init-${issue.id}`,
          timestamp: issue.timestamp || new Date().toISOString(),
          author: assignedOfficer,
          role: "Ward Officer",
          text: issue.adminNotes
        }
      ] : []);

  return {
    ...issue,
    department,
    priority,
    assignedOfficer,
    statusHistory,
    internalNotes
  };
};

/**
 * Service to manage civic issues with persistent local storage
 */
export const issueService = {
  // Get all issues
  getIssues: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ISSUES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeIssue);
          return normalized;
        }
      }
    } catch (e) {
      console.warn("Failed to load issues from localStorage", e);
    }
    // Default seed
    const normalizedSeed = INITIAL_ISSUES.map(normalizeIssue);
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(normalizedSeed));
    return normalizedSeed;
  },

  // Save all issues
  saveIssues: (issues) => {
    try {
      localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
    } catch (e) {
      console.error("Failed to save issues to localStorage", e);
    }
  },

  // Add new issue
  addIssue: (issueData) => {
    const issues = issueService.getIssues();
    const department = issueData.department || getDefaultDepartment(issueData.category);
    const priority = issueData.priority || getDefaultPriority(issueData.category);
    const assignedOfficer = issueData.assignedOfficer || getDefaultOfficer(department);
    const timestamp = new Date().toISOString();

    const newIssue = {
      id: `CC-${Math.floor(100 + Math.random() * 900)}`,
      timestamp,
      status: "Pending",
      percentage: 0,
      adminNotes: "Your issue has been logged. Municipal review is underway.",
      photo: issueData.photo || "/images/sample-issues/street-light.jpg",
      latitude: issueData.latitude || 19.2062 + (Math.random() - 0.5) * 0.05,
      longitude: issueData.longitude || 72.8398 + (Math.random() - 0.5) * 0.05,
      department,
      priority,
      assignedOfficer,
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          timestamp,
          status: "Pending",
          updatedBy: issueData.reporterName ? `${issueData.reporterName} (Citizen)` : "Citizen",
          note: "Grievance submitted via Civic Connect Citizen App"
        }
      ],
      internalNotes: [],
      ...issueData
    };
    const updated = [newIssue, ...issues];
    issueService.saveIssues(updated);
    return newIssue;
  },

  // Update existing issue
  updateIssue: (id, updates) => {
    const issues = issueService.getIssues();
    let updatedIssue = null;
    const updatedIssues = issues.map((issue) => {
      if (issue.id === id) {
        updatedIssue = { ...issue, ...updates };
        return updatedIssue;
      }
      return issue;
    });
    if (updatedIssue) {
      issueService.saveIssues(updatedIssues);
    }
    return updatedIssue;
  },

  // Reset to initial seed
  resetData: () => {
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  },

  // Get active user
  getActiveUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return INITIAL_USERS[0]; // Krish Patel
  },

  // Set active user
  setActiveUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
    } catch (e) {}
  },

  // Get all available demo users
  getAllUsers: () => INITIAL_USERS
};
