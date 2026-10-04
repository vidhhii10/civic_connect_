import React, { createContext, useContext, useState, useEffect } from "react";
import { issueService } from "../services/issueService";

const IssueContext = createContext();

export function IssueProvider({ children }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load issues on mount
  useEffect(() => {
    const loaded = issueService.getIssues();
    setIssues(loaded);
    setLoading(false);
  }, []);

  // Add an issue
  const addIssue = (newIssueData) => {
    const created = issueService.addIssue(newIssueData);
    setIssues((prev) => [created, ...prev]);
    return created;
  };

  // Update an issue
  const updateIssue = (id, updates) => {
    const updated = issueService.updateIssue(id, updates);
    if (updated) {
      setIssues((prev) =>
        prev.map((issue) => (issue.id === id ? { ...issue, ...updates } : issue))
      );
    }
    return updated;
  };

  // Reset to initial issues
  const resetToSeed = () => {
    const seeded = issueService.resetData();
    setIssues(seeded);
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        loading,
        addIssue,
        updateIssue,
        resetToSeed
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error("useIssues must be used within an IssueProvider");
  }
  return context;
}
