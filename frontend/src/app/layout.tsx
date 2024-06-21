"use client";
import React from "react";
import Head from "next/head";
import { AuthProvider } from "@/components/Auth/AuthContext";
import "./globals.css";
import Navbar from "@/components/Home/Navbar";
import { store } from "../store/store";
import { Provider } from "react-redux";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon-32x32.ico" />
      </Head>
      <body>
        <AuthProvider>
          <Provider store={store}>
            <Navbar />
            <div className="container mx-auto mt-4">{children}</div>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
