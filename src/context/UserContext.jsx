import React, { createContext, useContext, useState, useEffect } from "react";
import { issueService } from "../services/issueService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(issueService.getActiveUser());
  const allUsers = issueService.getAllUsers();

  const switchUser = (user) => {
    issueService.setActiveUser(user);
    setCurrentUserState(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, allUsers, switchUser }}>
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
