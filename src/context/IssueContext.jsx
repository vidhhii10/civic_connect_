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

  // Add an issue — persists locally, then fires n8n webhook (non-blocking)
  const addIssue = (newIssueData) => {
    const created = issueService.addIssue(newIssueData);
    setIssues((prev) => [created, ...prev]);

    // Fire-and-forget: POST to n8n automation webhook
    // Network failures are logged but never block the citizen submission
    fetch("https://vidhisp1010.app.n8n.cloud/webhook/submit-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(created),
    })
      .then((res) => {
        if (!res.ok) {
          console.warn("[n8n webhook] Non-OK response:", res.status, res.statusText);
        }
        return res.json().catch(() => null); // some n8n flows return empty body
      })
      .then((data) => {
        if (data) console.info("[n8n webhook] Acknowledged:", data);
      })
      .catch((err) => {
        console.warn("[n8n webhook] Network error (issue saved locally):", err);
      });

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
