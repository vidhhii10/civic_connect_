import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Navigation,
  AlertTriangle,
  RotateCcw,
  Building,
  UserCheck
} from "lucide-react";
import { useIssues } from "../../context/IssueContext";
import StatusBadge from "../../components/common/StatusBadge";
import AuthorityIssueModal from "../../components/authority/AuthorityIssueModal";
import { ISSUE_CATEGORIES } from "../../services/seedData";

// Zone 4 / Ward R/South Municipal Boundary Polygon (Kandivali/Charkop/Poisar jurisdiction)
const WARD_R_SOUTH_POLYGON = [
  [19.228, 72.822],
  [19.232, 72.862],
  [19.215, 72.875],
  [19.182, 72.865],
  [19.178, 72.828],
  [19.202, 72.812]
];

// Custom Color-Coded Map Pin Icon Generator
const createAuthorityPin = (issue, isSelected = false) => {
  const normStatus = (issue.status || "Pending").toLowerCase();

  let pinColor = "#f59e0b"; // Orange = Pending default
  let glowColor = "rgba(245, 158, 11, 0.4)";
  let badgeText = "P";

  if (normStatus.includes("resolved") || normStatus.includes("completed")) {
    pinColor = "#10b981"; // Emerald Green = Resolved
    glowColor = "rgba(16, 185, 129, 0.4)";
    badgeText = "✓";
  } else if (normStatus.includes("progress")) {
    pinColor = "#38bdf8"; // Cyan/Blue = In Progress
    glowColor = "rgba(56, 189, 248, 0.4)";
    badgeText = "⚙";
  } else if (normStatus.includes("rejected")) {
    pinColor = "#ef4444"; // Red = Rejected
    glowColor = "rgba(239, 68, 68, 0.4)";
    badgeText = "✕";
  }

  const isCritical = issue.priority === "Critical";
  const size = isSelected ? 40 : 34;
  const pulseClass = isCritical || normStatus === "pending" ? "map-pin-pulse" : "";

  const svgHtml = `
    <div class="auth-map-pin-wrapper ${pulseClass}" style="position: relative; width: ${size}px; height: ${size * 1.3}px; transform: translate(-50%, -100%);">
      <div class="pin-shadow" style="position: absolute; bottom: 0; left: 50%; width: 14px; height: 6px; background: rgba(0,0,0,0.6); border-radius: 50%; transform: translateX(-50%); filter: blur(2px);"></div>
      <svg viewBox="0 0 384 512" width="${size}" height="${size * 1.3}" style="filter: drop-shadow(0 4px 10px ${glowColor});">
        <path fill="${pinColor}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
        <circle cx="192" cy="192" r="76" fill="#131518" stroke="${isSelected ? "#ffffff" : pinColor}" stroke-width="${isSelected ? 16 : 8}"/>
      </svg>
      <div style="position: absolute; top: ${size * 0.28}px; left: 50%; transform: translateX(-50%); font-size: ${size * 0.38}px; font-weight: 800; color: #ffffff; pointer-events: none; font-family: monospace;">
        ${badgeText}
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "authority-custom-pin",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -size * 1.15]
  });
};

// Map Recenter Controller
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function AuthorityMapScreen() {
  const { issues } = useIssues();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Selected issue for quick-preview card
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Selected issue for action modal / drawer
  const [actionModalIssueId, setActionModalIssueId] = useState(null);

  // Map viewport centered on Zone 4 / Ward R/South (Mumbai)
  const [mapCenter, setMapCenter] = useState([19.2062, 72.845]);
  const [mapZoom, setMapZoom] = useState(13);

  // Filtered issues for map markers
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
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

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = (issue.id || "").toLowerCase().includes(q);
        const matchesCat = (issue.category || "").toLowerCase().includes(q);
        const matchesAddr = (issue.address || "").toLowerCase().includes(q);
        const matchesDesc = (issue.description || "").toLowerCase().includes(q);
        const matchesReporter = (issue.reporterName || "").toLowerCase().includes(q);
        const matchesDept = (issue.department || "").toLowerCase().includes(q);

        if (!matchesId && !matchesCat && !matchesAddr && !matchesDesc && !matchesReporter && !matchesDept) {
          return false;
        }
      }

      return true;
    });
  }, [issues, selectedStatus, selectedCategory, searchTerm]);

  // Dynamic KPI counts for Ward HUD
  const hudStats = useMemo(() => {
    return {
      total: issues.length,
      pending: issues.filter((i) => i.status === "Pending").length,
      inProgress: issues.filter((i) => i.status === "In Progress").length,
      resolved: issues.filter((i) => i.status === "Resolved" || i.status === "Completed").length
    };
  }, [issues]);

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
    setMapCenter([issue.latitude, issue.longitude]);
    setMapZoom(14);
  };

  const resetView = () => {
    setMapCenter([19.2062, 72.845]);
    setMapZoom(13);
    setSelectedIssue(null);
  };

  // Derive active issue for action modal
  const activeActionIssue = useMemo(() => {
    if (!actionModalIssueId) return null;
    return issues.find((i) => i.id === actionModalIssueId) || null;
  }, [issues, actionModalIssueId]);

  return (
    <div className="authority-map-screen-wrapper">
      {/* Top Filter and Controls Bar */}
      <div className="authority-map-header-bar">
        <div className="map-header-left">
          <div className="map-search-box">
            <Search size={16} className="map-search-icon" />
            <input
              type="text"
              className="map-search-input"
              placeholder="Search by ticket ID, location, category, citizen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="map-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
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
            title="Filter by Category"
          >
            <option value="All">All Categories</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="map-status-tabs">
          {["All", "Pending", "In Progress", "Resolved"].map((st) => (
            <button
              key={st}
              type="button"
              className={`map-status-tab ${selectedStatus === st ? "active" : ""}`}
              onClick={() => setSelectedStatus(st)}
            >
              <span>{st}</span>
              {st === "Pending" && <span className="tab-dot dot-pending" />}
              {st === "In Progress" && <span className="tab-dot dot-progress" />}
              {st === "Resolved" && <span className="tab-dot dot-resolved" />}
            </button>
          ))}
        </div>

        {/* Reset button */}
        {(searchTerm || selectedStatus !== "All" || selectedCategory !== "All") && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("All");
              setSelectedCategory("All");
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Map Canvas Area */}
      <div className="authority-map-canvas-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="authority-leaflet-map"
          zoomControl={false}
        >
          {/* Esri Dark Gray Base Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />

          <ChangeView center={mapCenter} zoom={mapZoom} />

          {/* Ward R/South Jurisdiction Boundary Highlight */}
          <Polygon
            positions={WARD_R_SOUTH_POLYGON}
            pathOptions={{
              color: "#38bdf8",
              weight: 2,
              opacity: 0.8,
              dashArray: "6, 8",
              fillColor: "#0284c7",
              fillOpacity: 0.08
            }}
          />

          {/* Render markers for all filtered issues */}
          {filteredIssues.map((issue) => {
            const isSelected = selectedIssue?.id === issue.id;

            return (
              <Marker
                key={issue.id}
                position={[issue.latitude, issue.longitude]}
                icon={createAuthorityPin(issue, isSelected)}
                eventHandlers={{
                  click: () => handleMarkerClick(issue)
                }}
              >
                <Popup className="dark-map-popup">
                  <div className="authority-popup-card">
                    <img
                      src={issue.photo || "/images/sample-issues/street-light.jpg"}
                      alt={issue.category}
                      className="popup-thumb"
                    />
                    <div className="popup-body">
                      <div className="popup-top">
                        <span className="popup-id">#{issue.id}</span>
                        <StatusBadge status={issue.status} />
                      </div>
                      <h4 className="popup-cat">{issue.category}</h4>
                      <p className="popup-addr">{issue.address}</p>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm popup-manage-btn"
                        onClick={() => setActionModalIssueId(issue.id)}
                      >
                        <SlidersHorizontal size={13} />
                        <span>Manage Ticket</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Ward R/South HUD Stats Overlay */}
        <div className="authority-map-hud">
          <div className="hud-title-row">
            <span className="hud-pulse-dot" />
            <div className="hud-title-col">
              <span className="hud-zone-tag">BMC Zone 4</span>
              <h4 className="hud-ward-name">Ward R/South Command</h4>
            </div>
          </div>

          <div className="hud-stats-grid">
            <div className="hud-stat-item">
              <span className="hud-stat-num">{hudStats.total}</span>
              <span className="hud-stat-label">Total Logged</span>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-num text-pending">{hudStats.pending}</span>
              <span className="hud-stat-label">Pending</span>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-num text-progress">{hudStats.inProgress}</span>
              <span className="hud-stat-label">In Progress</span>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-num text-resolved">{hudStats.resolved}</span>
              <span className="hud-stat-label">Resolved</span>
            </div>
          </div>
        </div>

        {/* Floating Recenter Button */}
        <div className="authority-map-recenter-btn-box">
          <button
            type="button"
            className="map-control-circle-btn"
            onClick={resetView}
            title="Recenter Ward R/South View"
          >
            <Navigation size={18} />
          </button>
        </div>

        {/* Selected Issue Quick-Preview Card (Docked Bottom Right) */}
        {selectedIssue && (
          <div className="authority-map-preview-drawer animate-slide-up">
            <div className="preview-drawer-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="preview-ticket-id">#{selectedIssue.id}</span>
                <span className={`table-prio-tag prio-${(selectedIssue.priority || "Medium").toLowerCase()}`}>
                  <AlertTriangle size={10} />
                  {selectedIssue.priority || "Medium"}
                </span>
                <StatusBadge status={selectedIssue.status} />
              </div>
              <button
                type="button"
                className="preview-close-btn"
                onClick={() => setSelectedIssue(null)}
                aria-label="Close preview"
              >
                ×
              </button>
            </div>

            <div className="preview-drawer-body">
              <img
                src={selectedIssue.photo || "/images/sample-issues/street-light.jpg"}
                alt={selectedIssue.category}
                className="preview-photo"
              />

              <div className="preview-info-col">
                <h4 className="preview-category-title">{selectedIssue.category}</h4>
                <p className="preview-desc-text">{selectedIssue.description}</p>

                <div className="preview-meta-chips">
                  <span>
                    <MapPin size={12} color="var(--accent-cyan)" />
                    {selectedIssue.address}
                  </span>
                  <span>
                    <Building size={12} color="var(--accent-cyan)" />
                    {selectedIssue.department || "General Municipal"}
                  </span>
                  <span>
                    <UserCheck size={12} />
                    {selectedIssue.assignedOfficer || "Unassigned"}
                  </span>
                </div>

                <div className="preview-actions-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setActionModalIssueId(selectedIssue.id)}
                  >
                    <SlidersHorizontal size={14} />
                    <span>Manage Issue Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal / Drawer for full management */}
      {activeActionIssue && (
        <AuthorityIssueModal
          issue={activeActionIssue}
          onClose={() => setActionModalIssueId(null)}
        />
      )}
    </div>
  );
}
