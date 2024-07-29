"use client";
import React from "react";
import { useAuth } from "./AuthContext";

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth()!;

  return (
    <div>
      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>No user is logged in</p>
      )}
    </div>
  );
};

export default UserProfile;
