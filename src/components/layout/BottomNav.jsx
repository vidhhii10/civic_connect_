import React from "react";
import { NavLink } from "react-router-dom";
import {
  LogIn,
  Home,
  MapPin,
  FileEdit,
  LayoutGrid,
  Camera
} from "lucide-react";

export default function BottomNav() {
  const navItems = [
    {
      to: "/users",
      label: "Users",
      icon: LogIn
    },
    {
      to: "/home",
      label: "Home Scr...",
      fullLabel: "Home Screen",
      icon: Home
    },
    {
      to: "/map",
      label: "Issue Map",
      fullLabel: "Issue Map",
      icon: MapPin
    },
    {
      to: "/report",
      label: "Issue Rep...",
      fullLabel: "Issue Reporting",
      icon: FileEdit
    },
    {
      to: "/issues",
      label: "Issue List",
      fullLabel: "Issue List",
      icon: LayoutGrid
    },
    {
      to: "/my-issues",
      label: "My Issues",
      fullLabel: "My Issues",
      icon: Camera
    }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            title={item.fullLabel || item.label}
          >
            <div className="nav-icon-wrapper">
              <Icon size={20} />
            </div>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
