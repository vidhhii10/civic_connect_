import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AuthoritySidebar from "./AuthoritySidebar";
import AuthorityHeader from "./AuthorityHeader";
import "./Authority.css";
import "../../pages/authority/AuthorityPages.css";

export default function AuthorityLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
