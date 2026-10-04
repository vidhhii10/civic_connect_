import React, { useState, useMemo } from "react";
import { Search, RotateCcw, AlertCircle, ArrowUpDown, Building, Download } from "lucide-react";
import { useIssues } from "../../context/IssueContext";
import AuthorityIssueTable from "../../components/authority/AuthorityIssueTable";
import AuthorityIssueCard from "../../components/authority/AuthorityIssueCard";
import AuthorityIssueModal from "../../components/authority/AuthorityIssueModal";
import { ISSUE_CATEGORIES, MUNICIPAL_DEPARTMENTS } from "../../services/seedData";
import { exportIssuesToCSV } from "../../utils/csvExport";

const PRIORITY_RANK = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

export default function AuthorityIssuesScreen() {
  const { issues, updateIssue } = useIssues();

  // Filters & Search & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "priority", "status"

  // Selected issue for action modal / drawer
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Dynamic category options from issues + seed
  const categoriesList = useMemo(() => {
    const set = new Set([...ISSUE_CATEGORIES, ...issues.map((i) => i.category)]);
    return ["All", ...Array.from(set)];
  }, [issues]);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    return {
      All: issues.length,
      Pending: issues.filter((i) => i.status === "Pending").length,
      "In Progress": issues.filter((i) => i.status === "In Progress").length,
      Resolved: issues.filter((i) => i.status === "Resolved" || i.status === "Completed").length,
      Rejected: issues.filter((i) => i.status === "Rejected").length
    };
  }, [issues]);

  // Filtered & Sorted issues
  const filteredIssues = useMemo(() => {
    const list = issues.filter((issue) => {
      // Status filter
      if (selectedStatus !== "All") {
        if (selectedStatus === "Resolved") {
          if (issue.status !== "Resolved" && issue.status !== "Completed") return false;
        } else if (issue.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All" && issue.category !== selectedCategory) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== "All" && issue.department !== selectedDepartment) {
        return false;
      }

      // Search query (ID, Category, Description, Address, Citizen/Reporter)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = (issue.id || "").toLowerCase().includes(q);
        const matchesCat = (issue.category || "").toLowerCase().includes(q);
        const matchesDesc = (issue.description || "").toLowerCase().includes(q);
        const matchesAddr = (issue.address || "").toLowerCase().includes(q);
        const matchesReporter = (issue.reporterName || "").toLowerCase().includes(q);
        const matchesDept = (issue.department || "").toLowerCase().includes(q);
        const matchesOfficer = (issue.assignedOfficer || "").toLowerCase().includes(q);

        if (!matchesId && !matchesCat && !matchesDesc && !matchesAddr && !matchesReporter && !matchesDept && !matchesOfficer) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (sortBy === "oldest") {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (sortBy === "priority") {
        const rankA = PRIORITY_RANK[a.priority] || 1;
        const rankB = PRIORITY_RANK[b.priority] || 1;
        if (rankB !== rankA) return rankB - rankA;
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }
      return 0;
    });
  }, [issues, selectedStatus, selectedCategory, selectedDepartment, searchTerm, sortBy]);

  // The active issue object for modal (derived from latest state to preserve live updates)
  const activeModalIssue = useMemo(() => {
    if (!selectedIssueId) return null;
    return issues.find((i) => i.id === selectedIssueId) || null;
  }, [issues, selectedIssueId]);

  // Handle status update directly from table selector
  const handleStatusChange = (issueId, newStatus, newPercentage) => {
    updateIssue(issueId, {
      status: newStatus,
      percentage: newPercentage
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedCategory("All");
    setSelectedDepartment("All");
    setSortBy("newest");
  };

  const isFiltered =
    searchTerm !== "" ||
    selectedStatus !== "All" ||
    selectedCategory !== "All" ||
    selectedDepartment !== "All" ||
    sortBy !== "newest";

  return (
    <div className="authority-issues-screen-container">
      {/* Header Row */}
      <div className="authority-issues-header">
        <div className="authority-page-title-row">
          <div>
            <h2>Civic Grievances Registry</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              Showing {filteredIssues.length} of {issues.length} total municipal tickets in Ward R/South
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => exportIssuesToCSV(filteredIssues)}
            title="Download structured CSV export of current ticket view"
          >
            <Download size={14} />
            <span>Export Table (.CSV)</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="authority-filter-toolbar">
          <div className="filter-left-controls">
            {/* Search Box */}
            <div className="filter-search-box">
              <Search size={16} className="filter-search-icon" />
              <input
                type="text"
                className="filter-search-input"
                placeholder="Search ticket ID, category, address, citizen, officer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="filter-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search query"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              className="filter-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              title="Filter by issue category"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            {/* Department Dropdown */}
            <div className="filter-dept-wrap">
              <Building size={14} className="filter-select-icon" />
              <select
                className="filter-dept-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                title="Filter by municipal department"
              >
                <option value="All">All Departments</option>
                {MUNICIPAL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Control */}
            <div className="filter-sort-wrap">
              <ArrowUpDown size={14} className="filter-select-icon" />
              <select
                className="filter-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title="Sort order"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="priority">Sort: Critical Priority First</option>
                <option value="status">Sort: By Status</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="filter-status-tabs">
            {["All", "Pending", "In Progress", "Resolved", "Rejected"].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-status-tab ${
                  selectedStatus === st ? "active" : ""
                }`}
                onClick={() => setSelectedStatus(st)}
              >
                <span>{st}</span>
                <span className="tab-count-pill">{statusCounts[st] || 0}</span>
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              className="filter-reset-btn"
              onClick={handleResetFilters}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Table on Desktop, Cards on Mobile */}
      {filteredIssues.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <AuthorityIssueTable
            issues={filteredIssues}
            onStatusChange={handleStatusChange}
            onSelectIssue={(issue) => setSelectedIssueId(issue.id)}
          />

          {/* Mobile Cards View */}
          <div className="authority-mobile-cards-list">
            {filteredIssues.map((issue) => (
              <AuthorityIssueCard
                key={issue.id}
                issue={issue}
                onStatusChange={handleStatusChange}
                onSelectIssue={(i) => setSelectedIssueId(i.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          className="authority-panel"
          style={{
            padding: 48,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12
          }}
        >
          <AlertCircle size={40} color="var(--text-muted)" />
          <h3 style={{ fontSize: 16, color: "#ffffff" }}>No matching civic issues found</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 380 }}>
            No municipal tickets match your active search, category, or department criteria.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Detailed Action Modal / Drawer */}
      {activeModalIssue && (
        <AuthorityIssueModal
          issue={activeModalIssue}
          onClose={() => setSelectedIssueId(null)}
        />
      )}
    </div>
  );
}

