import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  Percent,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Calendar,
  Layers
} from "lucide-react";
import { useIssues } from "../../context/IssueContext";
import AuthorityStatCard from "../../components/authority/AuthorityStatCard";
import StatusBadge from "../../components/common/StatusBadge";
import AuthorityIssueModal from "../../components/authority/AuthorityIssueModal";
import { ISSUE_CATEGORIES } from "../../services/seedData";

export default function AuthorityDashboard() {
  const { issues } = useIssues();
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Dynamic KPI Calculations
  const totalCount = issues.length;
  const pendingCount = issues.filter((i) => i.status === "Pending").length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;
  const completedCount = issues.filter(
    (i) => i.status === "Completed" || i.status === "Resolved"
  ).length;
  const completionRate = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  // Priority Attention Issues: Pending or In-Progress issues, prioritizing critical categories
  const attentionIssues = [...issues]
    .filter((i) => i.status === "Pending" || i.status === "In Progress")
    .sort((a, b) => {
      // Prioritize urgent categories
      const urgentCats = ["Exposed Wires", "Water Leakage", "Pothole"];
      const aUrgent = urgentCats.includes(a.category) ? 1 : 0;
      const bUrgent = urgentCats.includes(b.category) ? 1 : 0;
      if (aUrgent !== bUrgent) return bUrgent - aUrgent;
      return new Date(b.timestamp) - new Date(a.timestamp);
    })
    .slice(0, 5);

  // Category Workload Breakdown
  // Combine all categories present in issues and seed categories
  const allCategories = Array.from(
    new Set([...ISSUE_CATEGORIES, ...issues.map((i) => i.category)])
  );

  const categoryWorkload = allCategories.map((cat) => {
    const catIssues = issues.filter((i) => i.category === cat);
    const count = catIssues.length;
    const pendingInCat = catIssues.filter((i) => i.status === "Pending").length;
    const percentOfTotal = totalCount ? Math.round((count / totalCount) * 100) : 0;
    return {
      category: cat,
      count,
      pendingInCat,
      percentOfTotal
    };
  }).filter((item) => item.count > 0);

  // Recent Submissions (Sorted by timestamp descending)
  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div className="authority-dashboard-container">
      {/* 5 KPI Stat Cards */}
      <section className="authority-kpi-grid">
        <AuthorityStatCard
          label="Total Issues"
          value={totalCount}
          subtext="City-wide logged"
          icon={FileText}
          variant="total"
        />
        <AuthorityStatCard
          label="Pending Triage"
          value={pendingCount}
          subtext="Requires inspection"
          icon={Clock}
          variant="pending"
        />
        <AuthorityStatCard
          label="In Progress"
          value={inProgressCount}
          subtext="Field crew dispatched"
          icon={RefreshCw}
          variant="progress"
        />
        <AuthorityStatCard
          label="Resolved"
          value={completedCount}
          subtext="Work complete"
          icon={CheckCircle2}
          variant="completed"
        />
        <AuthorityStatCard
          label="Resolution Rate"
          value={`${completionRate}%`}
          subtext="Overall efficiency"
          icon={Percent}
          variant="rate"
        />
      </section>

      {/* Main 2-Column Split */}
      <div className="authority-dashboard-grid">
        {/* Left Column: Priority Attention & Recent Feed */}
        <div className="dashboard-col">
          {/* Priority Queue Panel */}
          <div className="authority-panel">
            <div className="authority-panel-header">
              <div className="panel-title-group">
                <AlertTriangle size={18} className="panel-title-icon" color="#f59e0b" />
                <h3 className="panel-title">Priority Attention Queue</h3>
                <span className="panel-badge">{attentionIssues.length} active</span>
              </div>
              <Link to="/authority/issues" className="panel-action-link">
                <span>Manage all</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="priority-queue-list">
              {attentionIssues.length > 0 ? (
                attentionIssues.map((issue) => {
                  const formattedDate = new Date(issue.timestamp).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short"
                    }
                  );

                  return (
                    <div
                      key={issue.id}
                      className="priority-queue-item priority-queue-clickable"
                      onClick={() => setSelectedIssueId(issue.id)}
                    >
                      <div className="priority-item-main">
                        <div className="priority-item-top">
                          <span className="priority-item-id">#{issue.id}</span>
                          <span className="priority-item-cat">{issue.category}</span>
                        </div>
                        <p className="priority-item-desc">{issue.description}</p>
                        <div className="priority-item-meta">
                          <span>
                            <MapPin size={12} color="var(--accent-cyan)" />
                            {issue.address}
                          </span>
                          <span>
                            <Calendar size={12} />
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      <div className="priority-item-actions">
                        <StatusBadge status={issue.status} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  All high-priority complaints have been addressed.
                </div>
              )}
            </div>
          </div>

          {/* Recent Submissions Panel */}
          <div className="authority-panel">
            <div className="authority-panel-header">
              <div className="panel-title-group">
                <Clock size={18} className="panel-title-icon" />
                <h3 className="panel-title">Recent Submissions</h3>
              </div>
              <Link to="/authority/issues" className="panel-action-link">
                <span>View registry</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="recent-issues-table-wrap">
              <table className="authority-data-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="authority-table-row-clickable"
                      onClick={() => setSelectedIssueId(issue.id)}
                    >
                      <td className="cell-ticket-id">#{issue.id}</td>
                      <td>
                        <span className="cell-cat-tag">{issue.category}</span>
                      </td>
                      <td>
                        <div className="cell-address">
                          <MapPin size={12} color="var(--accent-cyan)" />
                          <span>{issue.address}</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="cell-date">
                        {new Date(issue.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Category Workload Breakdown */}
        <div className="dashboard-col">
          <div className="authority-panel">
            <div className="authority-panel-header">
              <div className="panel-title-group">
                <Layers size={18} className="panel-title-icon" />
                <h3 className="panel-title">Category Workload</h3>
              </div>
              <span className="panel-badge">{categoryWorkload.length} sectors</span>
            </div>

            <div className="category-workload-list">
              {categoryWorkload.map((cat) => (
                <div key={cat.category} className="workload-item">
                  <div className="workload-header">
                    <span className="workload-name">{cat.category}</span>
                    <span className="workload-count">
                      {cat.count} {cat.count === 1 ? "issue" : "issues"}
                      {cat.pendingInCat > 0 && (
                        <span style={{ color: "var(--status-pending)", fontSize: 11, marginLeft: 6 }}>
                          ({cat.pendingInCat} pending)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="workload-bar-track">
                    <div
                      className="workload-bar-fill"
                      style={{ width: `${cat.percentOfTotal}%` }}
                      title={`${cat.percentOfTotal}% of total issues`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Authority Issue Modal */}
      {selectedIssueId && (
        <AuthorityIssueModal
          issue={issues.find((i) => i.id === selectedIssueId)}
          onClose={() => setSelectedIssueId(null)}
        />
      )}
    </div>
  );
}