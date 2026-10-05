import React, { createContext, useContext, useState, useEffect } from "react";
import { issueService } from "../services/issueService";
import { AUTHORITY_DEMO_ACCOUNTS } from "../services/seedData";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(issueService.getActiveUser());
  const [usersList, setUsersList] = useState(() => {
    try {
      const stored = localStorage.getItem("civic_connect_users_list_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return issueService.getAllUsers();
  });

  const switchUser = (user) => {
    issueService.setActiveUser(user);
    setCurrentUserState(user);
  };

  const login = (identifier, password) => {
    const trimmed = (identifier || "").trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: "Please enter your email or username." };
    }

    const authorityAccount = AUTHORITY_DEMO_ACCOUNTS.find(
      (account) => account.email === trimmed
    );
    if (authorityAccount) {
      if (authorityAccount.password !== password) {
        return { success: false, error: "Incorrect authority email or password." };
      }
      const user = { ...authorityAccount };
      delete user.password;
      switchUser(user);
      return { success: true, user };
    }

    // Match existing user by email or name
    const found = usersList.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        u.name.toLowerCase() === trimmed ||
        (u.contact && u.contact.replace(/\D/g, "") === trimmed.replace(/\D/g, ""))
    );

    if (found) {
      switchUser(found);
      return { success: true, user: found };
    }

    // If identifier is an email and password is provided (min 6 chars), authenticate dynamically
    if (trimmed.includes("@") && password && password.length >= 6) {
      const namePart = trimmed.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = namePart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const newUser = {
        id: `usr-${Date.now()}`,
        name: formattedName || "Citizen User",
        email: identifier.trim(),
        contact: "98" + Math.floor(10000000 + Math.random() * 90000000),
        role: "Active Citizen",
        address: "Mumbai, Maharashtra",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`
      };

      const updated = [newUser, ...usersList];
      setUsersList(updated);
      try {
        localStorage.setItem("civic_connect_users_list_v1", JSON.stringify(updated));
      } catch (e) {}

      switchUser(newUser);
      return { success: true, user: newUser };
    }

    return {
      success: false,
      error: "No matching citizen account found. Please check your credentials or click Sign Up below."
    };
  };

  const signup = (userData) => {
    const trimmedEmail = (userData.email || "").trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead."
      };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim(),
      contact: userData.contact ? userData.contact.trim() : "98" + Math.floor(10000000 + Math.random() * 90000000),
      role: userData.role || "Active Citizen",
      address: userData.address ? userData.address.trim() : "Mumbai, Maharashtra",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`
    };

    const updated = [newUser, ...usersList];
    setUsersList(updated);
    try {
      localStorage.setItem("civic_connect_users_list_v1", JSON.stringify(updated));
    } catch (e) {}

    switchUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    issueService.clearActiveUser();
    const defaultUser = issueService.getAllUsers()[0];
    setCurrentUserState(defaultUser);
    return { success: true };
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers: usersList,
        switchUser,
        login,
        signup,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
