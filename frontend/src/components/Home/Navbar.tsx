"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth() || {};
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        router.push("/"); 
      }
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/todos" className="text-gray-300 hover:text-white">
          <img
            src="/images/logo-horizontal-white.png"
            alt="Study Sphere"
            className="h-8"
          />
        </Link>
        <div className="space-x-4">
          {currentUser ? (
            <>
              <Link href="/todos" className="text-gray-300 hover:text-white">
                Todos
              </Link>
              <Link href="/study" className="text-gray-300 hover:text-white">
                Study
              </Link>
              {/* 
              <Link href="/timer" className="text-gray-300 hover:text-white">
                Timer
              </Link>*/}
              <Link href="/chatroom" className="text-gray-300 hover:text-white">
                Community
              </Link> 
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
