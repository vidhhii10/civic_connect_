import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Search, AlertCircle, RefreshCw } from "lucide-react";
import { useIssues } from "../context/IssueContext";
import { ISSUE_CATEGORIES } from "../services/seedData";
import SearchBar from "../components/common/SearchBar";
import IssueCard from "../components/issues/IssueCard";
import IssueDetailModal from "../components/issues/IssueDetailModal";

export default function IssueListScreen() {
  const navigate = useNavigate();
  const { issues } = useIssues();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeModalIssue, setActiveModalIssue] = useState(null);

  const filterCategories = ["All", ...ISSUE_CATEGORIES];
  const filterStatuses = ["All", "Pending", "In Progress", "Completed"];

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Category filter
      const matchesCat =
        selectedCategory === "All" || issue.category === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === "All" ||
        issue.status.toLowerCase() === selectedStatus.toLowerCase();

      // Search term
      const matchesSearch =
        !searchTerm.trim() ||
        issue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [issues, selectedCategory, selectedStatus, searchTerm]);

  return (
    <div className="issue-list-container">
      {/* Search Header */}
      <div className="list-top-bar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
          placeholder="Search issues, address, category..."
        />
        <button
          className="btn btn-primary add-issue-btn"
          onClick={() => navigate("/report")}
          title="Add new issue"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="cat-filter-scroll">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            className={`cat-filter-pill ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="status-tabs-row">
        {filterStatuses.map((st) => (
          <button
            key={st}
            className={`status-tab ${selectedStatus === st ? "active" : ""}`}
            onClick={() => setSelectedStatus(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="list-results-meta">
        <span>
          Showing <strong>{filteredIssues.length}</strong> of {issues.length} issues
        </span>
        {(selectedCategory !== "All" || selectedStatus !== "All" || searchTerm) && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedStatus("All");
              setSearchTerm("");
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Issue Card Grid */}
      <div className="issue-cards-grid">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={setActiveModalIssue}
              showUser={true}
            />
          ))
        ) : (
          <div className="empty-state-box">
            <AlertCircle size={36} color="var(--text-muted)" />
            <h3>No issues found</h3>
            <p>Try adjusting your search criteria or category filter.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedStatus("All");
                setSearchTerm("");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalIssue && (
        <IssueDetailModal
          issue={activeModalIssue}
          onClose={() => setActiveModalIssue(null)}
        />
      )}
    </div>
  );
}
