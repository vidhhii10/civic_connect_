import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthoritySidebar from "./AuthoritySidebar";
import AuthorityHeader from "./AuthorityHeader";
import "./Authority.css";
import "../../pages/authority/AuthorityPages.css";

export default function AuthorityLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useUser();
  const location = useLocation();

  if (!currentUser?.authorityRole) {
    return <Navigate to="/authority/login" replace state={{ from: location.pathname }} />;
  }

  if (["/authority/analytics", "/authority/map"].includes(location.pathname) && currentUser.authorityRole !== "supervisor") {
    return <Navigate to="/authority/dashboard" replace />;
  }

  return (
    <div className="authority-shell">
      {/* Authority Sidebar */}
      <AuthoritySidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="authority-main-wrapper">
        <AuthorityHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />
        <main className="authority-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
