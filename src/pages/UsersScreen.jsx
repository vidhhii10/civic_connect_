import React, { useState } from "react";
import { User, Check, Phone, Mail, MapPin, Shield, RefreshCw, UserPlus } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useIssues } from "../context/IssueContext";

export default function UsersScreen() {
  const { currentUser, allUsers, switchUser } = useUser();
  const { issues, resetToSeed } = useIssues();

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const userObj = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      contact: newUserPhone.trim() || "9800000000",
      email: `${newUserName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      role: "Citizen",
      address: newUserAddress.trim() || "Mumbai, Maharashtra",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newUserName)}`
    };

    switchUser(userObj);
    setShowAddUser(false);
    setNewUserName("");
    setNewUserPhone("");
    setNewUserAddress("");
  };

  return (
    <div className="users-screen-container">
      <div className="users-header">
        <h2 className="users-page-title">Citizen Profiles</h2>
        <p className="users-subtitle">
          Select or switch active citizen identity to test localized issue reporting and tracking.
        </p>
      </div>

      {/* Active User Highlight Card */}
      <div className="active-user-banner">
        <div className="active-user-badge">CURRENTLY ACTIVE</div>
        <div className="active-user-main">
          <div className="active-user-avatar">
            <User size={30} color="#38bdf8" />
          </div>
          <div className="active-user-details">
            <h3 className="active-user-name">{currentUser.name}</h3>
            <span className="active-user-role">{currentUser.role}</span>
            <div className="active-user-contact-row">
              <span><Phone size={12} /> {currentUser.contact}</span>
              <span><Mail size={12} /> {currentUser.email}</span>
            </div>
            <span className="active-user-addr"><MapPin size={12} /> {currentUser.address}</span>
          </div>
        </div>
      </div>

      {/* Available Citizen Switcher List */}
      <div className="citizens-list-section">
        <h3 className="section-title">Switch Citizen Account</h3>

        <div className="citizens-grid">
          {allUsers.map((user) => {
            const isCurrent = user.id === currentUser.id;
            const userIssuesCount = issues.filter(
              (i) => i.reporterName.toLowerCase() === user.name.toLowerCase()
            ).length;

            return (
              <div
                key={user.id}
                className={`citizen-card ${isCurrent ? "selected" : ""}`}
                onClick={() => switchUser(user)}
              >
                <div className="citizen-card-header">
                  <div className="citizen-avatar">
                    <User size={20} color={isCurrent ? "#38bdf8" : "#9ca3af"} />
                  </div>
                  <div className="citizen-info">
                    <h4 className="citizen-name">{user.name}</h4>
                    <span className="citizen-sub">{user.role} • {user.contact}</span>
                  </div>
                  {isCurrent && (
                    <div className="check-badge">
                      <Check size={14} color="#ffffff" />
                    </div>
                  )}
                </div>

                <div className="citizen-card-footer">
                  <span className="citizen-reports-tag">
                    {userIssuesCount} reported issues
                  </span>
                  <button
                    className={`btn btn-sm ${isCurrent ? "btn-primary" : "btn-secondary"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      switchUser(user);
                    }}
                  >
                    {isCurrent ? "Active" : "Switch To"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Citizen Creator */}
      <div className="custom-citizen-section">
        {!showAddUser ? (
          <button
            className="btn btn-secondary btn-block"
            onClick={() => setShowAddUser(true)}
          >
            <UserPlus size={16} />
            <span>Create New Demo Citizen</span>
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="add-citizen-form">
            <h4 className="form-sub-title">Add New Citizen</h4>
            <input
              type="text"
              placeholder="Citizen Full Name (e.g. Diya Mehta)"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Contact Number (e.g. 9819001122)"
              value={newUserPhone}
              onChange={(e) => setNewUserPhone(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Neighborhood / Address (e.g. Bandra West, Mumbai)"
              value={newUserAddress}
              onChange={(e) => setNewUserAddress(e.target.value)}
              required
            />
            <div className="form-actions-inline">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Set Active
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reset Mock Data Option */}
      <div className="reset-section">
        <button
          className="btn btn-outline btn-block"
          onClick={() => {
            if (window.confirm("Reset all issue records and users to initial prototype state?")) {
              resetToSeed();
              alert("Data restored to initial Mumbai prototype state.");
            }
          }}
        >
          <RefreshCw size={15} />
          <span>Reset All Mock Data to Default</span>
        </button>
      </div>
    </div>
  );
}
