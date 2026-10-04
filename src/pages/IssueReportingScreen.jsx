import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, X, ChevronDown, Check, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useIssues } from "../context/IssueContext";
import { useUser } from "../context/UserContext";
import { ISSUE_CATEGORIES } from "../services/seedData";
import ImageUploader from "../components/common/ImageUploader";
import VoiceRecorder from "../components/common/VoiceRecorder";

export default function IssueReportingScreen() {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const { currentUser } = useUser();

  // Format current date-time for the input
  const getCurrentDateTimeString = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Form State
  const [name, setName] = useState(currentUser.name || "Krish Patel");
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [timestamp, setTimestamp] = useState(getCurrentDateTimeString());
  const [contact, setContact] = useState(currentUser.contact || "987654322");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [address, setAddress] = useState("Mahavir Nagar, Kandivali West");
  const [coordinates, setCoordinates] = useState({ lat: 19.2062, lng: 72.8398 });
  const [locationStatus, setLocationStatus] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Update name and contact when active user changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setContact(currentUser.contact);
    }
  }, [currentUser]);

  // Handle GPS location toggle
  const handleLocationToggle = (e) => {
    const checked = e.target.checked;
    setUseCurrentLocation(checked);

    if (checked) {
      setLocationStatus("Detecting current GPS location...");
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setCoordinates({ lat: latitude, lng: longitude });

            try {
              // Reverse geocoding via OpenStreetMap Nominatim
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              if (data && data.display_name) {
                // Extract clean short road / neighbourhood name
                const shortAddr =
                  data.address?.suburb ||
                  data.address?.neighbourhood ||
                  data.address?.road ||
                  data.display_name.split(",")[0];
                setAddress(`${shortAddr}, Mumbai (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                setLocationStatus("Location locked accurately");
              } else {
                setAddress(`GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                setLocationStatus("GPS coordinates locked");
              }
            } catch (err) {
              setAddress(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
              setLocationStatus("GPS coordinates acquired");
            }
          },
          (err) => {
            console.warn("Geolocation error:", err);
            setLocationStatus("Unable to access GPS. Using default city location.");
            setAddress("Mahavir Nagar, Kandivali West");
          },
          { timeout: 8000 }
        );
      } else {
        setLocationStatus("Geolocation not supported by your browser.");
      }
    } else {
      setLocationStatus("");
      setAddress("Mahavir Nagar, Kandivali West");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!category) {
      setErrorMsg("Please select an issue category.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Please provide a description of the issue.");
      return;
    }

    setIsSubmitting(true);

    const newIssue = {
      reporterName: name.trim() || "Anonymous Citizen",
      contact: contact.trim() || "N/A",
      category,
      description: description.trim(),
      photo: photo || "/images/sample-issues/street-light.jpg",
      audio: audioData,
      timestamp: new Date(timestamp).toISOString(),
      address: address.trim() || "Mumbai Central Zone",
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      status: "Pending",
      percentage: 0,
      adminNotes: "Your issue has been logged. Municipal inspection scheduled within 24-48 hours."
    };

    try {
      addIssue(newIssue);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Brief pause to show celebration before redirecting to My Issues
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/my-issues");
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit issue. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-screen-container">
      <h2 className="report-screen-title">Add your issue</h2>

      {errorMsg && (
        <div className="report-error-alert">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form-card">
        {/* Name Field matching Screenshot 1 */}
        <div className="form-group">
          <label className="form-label" htmlFor="reporter-name">
            Name
          </label>
          <input
            id="reporter-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        {/* Photo Upload matching Screenshot 1 */}
        <div className="form-group">
          <label className="form-label">Photo</label>
          <ImageUploader image={photo} onImageChange={setPhoto} />
        </div>

        {/* Category Dropdown matching Screenshot 1 */}
        <div className="form-group">
          <label className="form-label" htmlFor="issue-category">
            Category
          </label>
          <div className="select-wrapper">
            <select
              id="issue-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">—</option>
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="select-icons">
              {category && (
                <button
                  type="button"
                  className="select-clear-btn"
                  onClick={() => setCategory("")}
                  aria-label="Clear category"
                >
                  <X size={14} />
                </button>
              )}
              <ChevronDown size={16} className="select-caret" />
            </div>
          </div>
        </div>

        {/* Description Textarea matching Screenshot 1 */}
        <div className="form-group">
          <label className="form-label" htmlFor="issue-desc">
            Description
          </label>
          <textarea
            id="issue-desc"
            className="form-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add issue Description in English/Hindi/Marathi....."
            required
          />
        </div>

        {/* Voice Recording matching Screenshot 1 */}
        <div className="form-group">
          <VoiceRecorder
            audioData={audioData}
            onAudioChange={setAudioData}
          />
        </div>

        {/* Timestamp matching Screenshot 1 & 5 */}
        <div className="form-group">
          <label className="form-label" htmlFor="issue-time">
            Timestamp
          </label>
          <div className="timestamp-input-wrapper">
            <Calendar size={18} className="timestamp-icon" />
            <input
              id="issue-time"
              type="datetime-local"
              className="form-input timestamp-input"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Contact Field matching Screenshot 5 */}
        <div className="form-group">
          <label className="form-label" htmlFor="issue-contact">
            Contact
          </label>
          <input
            id="issue-contact"
            type="tel"
            className="form-input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Mobile number or email"
            required
          />
        </div>

        {/* Use Current Location Toggle matching Screenshot 5 */}
        <div className="form-location-toggle-row">
          <div className="location-toggle-label">
            <MapPin size={18} className="location-toggle-icon" />
            <span>Use current location</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={handleLocationToggle}
            />
            <span className="slider round" />
          </label>
        </div>

        {/* Location address display / edit */}
        <div className="form-group location-addr-group">
          <label className="form-label-sub">Issue Address</label>
          <input
            type="text"
            className="form-input form-input-sub"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or landmark"
            required
          />
          {locationStatus && (
            <span className="location-status-hint">{locationStatus}</span>
          )}
        </div>

        {/* Submit Button matching Screenshot 5 */}
        <div className="form-submit-row">
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
