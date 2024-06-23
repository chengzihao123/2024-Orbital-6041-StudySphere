"use client";
import React from "react";
import Head from "next/head";
import { AuthProvider } from "@/components/Auth/AuthContext";
import "./globals.css";
import Navbar from "@/components/Home/Navbar";
import { store, RootState } from "../store/store";
import { Provider, useSelector } from "react-redux";
import { FullScreenTopBar } from "@/components/Study/FullScreenTopBar";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isFullscreen } = useSelector((state: RootState) => state.timer);

  return (
    <>
      {!isFullscreen ? <Navbar /> : <FullScreenTopBar />}
      <div className={`container mx-auto ${!isFullscreen ? "mt-4" : "mt-1"}`}>
        {children}
      </div>
    </>
  );
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon-32x32.ico" />
      </Head>
      <body>
        <AuthProvider>
          <Provider store={store}>
            <LayoutContent>{children}</LayoutContent>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
