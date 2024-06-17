"use client";
import React from 'react';
import Head from 'next/head'; 
import { AuthProvider } from '@/components/Auth/AuthContext'; 
import './globals.css';
import Navbar from "@/components/Home/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon-32x32.ico" /> 
      </Head>
      <body>
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto mt-4">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;