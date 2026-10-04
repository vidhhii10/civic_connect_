import { INITIAL_ISSUES, INITIAL_USERS } from "./seedData";

const STORAGE_KEY_ISSUES = "civic_connect_issues_v1";
const STORAGE_KEY_ACTIVE_USER = "civic_connect_active_user_v1";

/**
 * Service to manage civic issues with persistent local storage
 */
export const issueService = {
  // Get all issues
  getIssues: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ISSUES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load issues from localStorage", e);
    }
    // Default seed
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
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
    const newIssue = {
      id: `CC-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      status: "Pending",
      percentage: 0,
      adminNotes: "Your issue has been logged. Municipal review is underway.",
      photo: issueData.photo || "/images/sample-issues/street-light.jpg",
      latitude: issueData.latitude || 19.2062 + (Math.random() - 0.5) * 0.05,
      longitude: issueData.longitude || 72.8398 + (Math.random() - 0.5) * 0.05,
      ...issueData
    };
    const updated = [newIssue, ...issues];
    issueService.saveIssues(updated);
    return newIssue;
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
