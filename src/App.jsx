import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { IssueProvider } from "./context/IssueContext";

// Citizen Layout Components
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import SidebarDrawer from "./components/layout/SidebarDrawer";

// CSS Imports
import "./index.css";
import "./components/layout/Layout.css";
import "./components/common/Common.css";
import "./components/issues/Issues.css";
import "./pages/Pages.css";

// Citizen Pages
import HomeScreen from "./pages/HomeScreen";
import IssueMapScreen from "./pages/IssueMapScreen";
import IssueReportingScreen from "./pages/IssueReportingScreen";
import IssueListScreen from "./pages/IssueListScreen";
import MyIssuesScreen from "./pages/MyIssuesScreen";
import UsersScreen from "./pages/UsersScreen";

// Authority Components & Pages
import AuthorityLayout from "./components/authority/AuthorityLayout";
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
import AuthorityIssuesScreen from "./pages/authority/AuthorityIssuesScreen";
import AuthorityMapScreen from "./pages/authority/AuthorityMapScreen";
import AuthorityAnalyticsScreen from "./pages/authority/AuthorityAnalyticsScreen";

function CitizenLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Map screen has edge-to-edge layout without content padding
  const isMapScreen = location.pathname === "/map";

  return (
    <div className="app-shell">
      {/* Top Header with Menu */}
      <Header onOpenMenu={() => setIsDrawerOpen(true)} />

      {/* Slide-out Drawer */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <main className={`app-content ${isMapScreen ? "no-padding" : ""}`}>
        <Outlet />
      </main>

      {/* Fixed Bottom Navigation matching Glide prototype */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <IssueProvider>
          <Routes>
            {/* Citizen Routes - mobile-first shell */}
            <Route element={<CitizenLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/map" element={<IssueMapScreen />} />
              <Route path="/report" element={<IssueReportingScreen />} />
              <Route path="/issues" element={<IssueListScreen />} />
              <Route path="/my-issues" element={<MyIssuesScreen />} />
              <Route path="/users" element={<UsersScreen />} />
            </Route>

            {/* Authority Routes - full-width desktop command layout */}
            <Route path="/authority" element={<AuthorityLayout />}>
              <Route index element={<AuthorityDashboard />} />
              <Route path="issues" element={<AuthorityIssuesScreen />} />
              <Route path="map" element={<AuthorityMapScreen />} />
              <Route path="analytics" element={<AuthorityAnalyticsScreen />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </IssueProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
