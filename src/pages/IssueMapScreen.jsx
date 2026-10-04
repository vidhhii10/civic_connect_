import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, MapPin, Eye, Navigation, Filter } from "lucide-react";
import { useIssues } from "../context/IssueContext";
import StatusBadge from "../components/common/StatusBadge";
import IssueDetailModal from "../components/issues/IssueDetailModal";

// Custom SVG Blue Pin Icon matching Screenshot 4
const createCustomPin = (isSelected = false) => {
  const pinColor = isSelected ? "#38bdf8" : "#0284c7";
  const size = isSelected ? 38 : 32;

  const svgHtml = `
    <div style="position: relative; width: ${size}px; height: ${size * 1.3}px; transform: translate(-50%, -100%);">
      <svg viewBox="0 0 384 512" width="${size}" height="${size * 1.3}" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.6));">
        <path fill="${pinColor}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
        <circle cx="192" cy="192" r="72" fill="#131315"/>
        <circle cx="192" cy="192" r="36" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -size * 1.1]
  });
};

// Component to handle pan to selected coordinates
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function IssueMapScreen() {
  const { issues } = useIssues();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeModalIssue, setActiveModalIssue] = useState(null);
  const [mapCenter, setMapCenter] = useState([19.185, 72.845]); // Central Mumbai Western Suburbs
  const [mapZoom, setMapZoom] = useState(12);

  // Filter markers based on search query
  const filteredIssues = useMemo(() => {
    if (!searchTerm.trim()) return issues;
    const term = searchTerm.toLowerCase();
    return issues.filter(
      (issue) =>
        issue.address.toLowerCase().includes(term) ||
        issue.category.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term) ||
        issue.reporterName.toLowerCase().includes(term)
    );
  }, [issues, searchTerm]);

  const handleMarkerClick = (issue) => {
    setSelectedIssue(issue);
    setMapCenter([issue.latitude, issue.longitude]);
    setMapZoom(14);
  };

  const resetView = () => {
    setMapCenter([19.185, 72.845]);
    setMapZoom(12);
    setSelectedIssue(null);
  };

  return (
    <div className="map-screen-container">
      {/* Top Search Bar matching Screenshot 2 & 4 */}
      <div className="map-search-header">
        <h2 className="map-page-title">City Issue Map</h2>
        <div className="map-search-bar">
          <Search size={18} className="map-search-icon" />
          <input
            type="text"
            className="map-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
          {searchTerm && (
            <button
              className="map-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="map-canvas-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="city-map-container"
          zoomControl={false}
        >
          {/* Free Dark Canvas Tiles without watermarks */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />

          <ChangeView center={mapCenter} zoom={mapZoom} />

          {/* Render markers for issues */}
          {filteredIssues.map((issue) => {
            const isSelected = selectedIssue?.id === issue.id;
            return (
              <Marker
                key={issue.id}
                position={[issue.latitude, issue.longitude]}
                icon={createCustomPin(isSelected)}
                eventHandlers={{
                  click: () => handleMarkerClick(issue)
                }}
              >
                <Popup className="dark-map-popup">
                  <div className="map-popup-inner">
                    <img
                      src={issue.photo || "/images/sample-issues/street-light.jpg"}
                      alt={issue.category}
                      className="map-popup-thumb"
                    />
                    <div className="map-popup-content">
                      <div className="map-popup-header">
                        <span className="map-popup-cat">{issue.category}</span>
                        <StatusBadge status={issue.status} />
                      </div>
                      <p className="map-popup-addr">{issue.address}</p>
                      <button
                        className="btn btn-primary map-popup-btn"
                        onClick={() => setActiveModalIssue(issue)}
                      >
                        <Eye size={14} />
                        <span>View Issue Details</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Custom Controls */}
        <div className="map-floating-controls">
          <button
            className="map-control-btn"
            onClick={resetView}
            title="Recenter Map"
          >
            <Navigation size={18} />
          </button>
        </div>

        {/* Selected Issue Bottom Sheet Preview */}
        {selectedIssue && (
          <div className="map-bottom-sheet">
            <div className="bottom-sheet-content">
              <img
                src={selectedIssue.photo || "/images/sample-issues/street-light.jpg"}
                alt={selectedIssue.category}
                className="bottom-sheet-img"
              />
              <div className="bottom-sheet-details">
                <div className="bottom-sheet-top">
                  <span className="bottom-sheet-cat">{selectedIssue.category}</span>
                  <StatusBadge status={selectedIssue.status} />
                </div>
                <h4 className="bottom-sheet-addr">{selectedIssue.address}</h4>
                <p className="bottom-sheet-desc">{selectedIssue.description}</p>
                <div className="bottom-sheet-actions">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => setActiveModalIssue(selectedIssue)}
                  >
                    View Complete Report
                  </button>
                </div>
              </div>
            </div>
            <button
              className="bottom-sheet-close"
              onClick={() => setSelectedIssue(null)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Full detail modal */}
      {activeModalIssue && (
        <IssueDetailModal
          issue={activeModalIssue}
          onClose={() => setActiveModalIssue(null)}
        />
      )}
    </div>
  );
}
